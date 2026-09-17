import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from '../models/user.model.js' 
import type {QueryFilter} from "mongoose";
import type { SortOrder } from "mongoose";

const getSingleMentor = asyncHandler(async(req,res) => {
    const mentor = await User.findOne({
        _id:req.params.id,
        role:"mentor"
   })
   .select("-password -refreshToken")

   if (!mentor) {
      throw new ApiError(404,"Mentor not found")
   }

   return res
   .status(200)
   .json(
      new ApiResponse(200, mentor,"Mentor fetched successfully"
      )
   )
})

interface GetMentorsQuery {
    search?:string;
    specialization?:string;
    minPrice?:string;
    maxPrice?:string;
    rating?:string;
    sortBy?:"price" | "rating" | "experience"
    order?: "asc" | "desc"
    page?:string;
    limit?:string;
}

const getAllMentors = asyncHandler(async (req, res) => {

    const {search , specialization , minPrice , maxPrice , rating , sortBy , order} = req.query as GetMentorsQuery

    let query: any = {
        role: "mentor"
    }

    const andConditions: any[] = [];

    if (search && search.trim()) {
        const trimmedSearch = search.trim();
        andConditions.push({
            $or: [
                { name: { $regex: trimmedSearch, $options: "i" } },
                { "mentorProfile.bio": { $regex: trimmedSearch, $options: "i" } },
                { "mentorProfile.expertise": { $regex: trimmedSearch, $options: "i" } },
                { "mentorProfile.title": { $regex: trimmedSearch, $options: "i" } }
            ]
        });
    }

    if (specialization && typeof specialization === "string" && specialization.trim() && specialization.trim().toLowerCase() !== "all") {
        const specMap: Record<string, string> = {
            "therapist": "therap|counselor|psycholog",
            "ui / ux designer": "(ui\\s*[/&]?\\s*ux|ux\\s*[/&]?\\s*ui|\\bui\\b|\\bux\\b|designer)",
            "software engineer": "(software|engineer|developer|frontend|backend|fullstack|full-stack|full\\s+stack|coder|programmer|web\\s+dev)",
            "product manager": "(product\\s+manager|product\\s+management|product\\s+lead|\\bpm\\b|head\\s+of\\s+product)",
            "career coach": "(career|coach)",
            "finance mentor": "(finance|financial|fintech|wealth|investment|banker)",
            "startup founder": "(founder|entrepreneur|startup)",
            "data scientist": "(data\\s+scientist|data\\s+science|data\\s+analyst|data\\s+engineer|\\bdata\\b|machine\\s+learning|\\bml\\b|\\bai\\b)"
        };

        const key = specialization.toLowerCase().trim();
        const pattern = specMap[key] || specialization.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        andConditions.push({
            "mentorProfile.title": { $regex: pattern, $options: "i" }
        });
    }

    if (andConditions.length > 0) {
        query.$and = andConditions;
    }

    if (minPrice || maxPrice) {
        query["mentorProfile.pricing"] = {};

        if (minPrice && !isNaN(Number(minPrice))) {
            query["mentorProfile.pricing"].$gte = Math.max(0, Number(minPrice));
        }

        if (maxPrice && !isNaN(Number(maxPrice))) {
            query["mentorProfile.pricing"].$lte = Math.max(0, Number(maxPrice));
        }
    }

    if (rating && !isNaN(Number(rating))) {
        query["mentorProfile.avgRating"] = {
            $gte: Number(rating)
        };
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const sortDirection = order === "asc" ? 1 : -1;

    const totalMentors = await User.countDocuments(query);

    let mentors;

    if (sortBy === "experience") {
        // Numeric extraction of years of experience from string (e.g. "5 years", "10+", "3")
        mentors = await User.aggregate([
            { $match: query },
            {
                $addFields: {
                    numericExperience: {
                        $convert: {
                            input: {
                                $arrayElemAt: [
                                    {
                                        $regexFindAll: {
                                            input: { $ifNull: ["$mentorProfile.experience", "0"] },
                                            regex: "[0-9]+"
                                        }
                                    },
                                    0
                                ]
                            },
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    }
                }
            },
            { $sort: { numericExperience: sortDirection, _id: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    password: 0,
                    refreshToken: 0,
                    numericExperience: 0
                }
            }
        ]);
    } else {
        let sortOptions: Record<string, SortOrder> = {};

        const sortMap: Record<string, string> = {
            price: "mentorProfile.pricing",
            rating: "mentorProfile.avgRating"
        };

        if (sortBy && sortMap[sortBy]) {
            sortOptions[sortMap[sortBy]] = sortDirection;
        } else {
            sortOptions["createdAt"] = -1;
        }

        mentors = await User.find(query)
            .select("-password -refreshToken")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    mentors,
                    currentPage: page,
                    totalPages: Math.ceil(totalMentors / limit) || 1,
                    totalMentors
                },
                "Mentors fetched successfully"
            )
        );
});

export {
    getSingleMentor,
    getAllMentors,
}
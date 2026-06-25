import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from '../models/user.model.js' 

const getSingleMentor = asyncHandler(async(req,res) => {
    const mentor = await User.findById({
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

    let query:any = {
        role: "mentor"
    }

    if (search) {
        query.$or = [
            { 
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                "mentorProfile.bio": {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                "mentorProfile.expertise": {
                    $regex: search,
                    $options: "i"
                }
            }
        ]
    }

       if (specialization) {
        query[
            "mentorProfile.expertise"
        ] = {
            $in: [specialization]
        }
        }

        if (minPrice || maxPrice) {
             query[
                 "mentorProfile.pricing"
              ] = {}
              
        if (minPrice) {
            query[
                "mentorProfile.pricing"
            ].$gte = Number(minPrice)
        }

        if (maxPrice) {
            query[
                "mentorProfile.pricing"
            ].$lte = Number(maxPrice)
        }
     }

        if (rating) {
            query[
                "mentorProfile.avgRating"
            ] = {

                $gte: Number(rating)
            }
        }

        let sortOptions:any = {}

        if (sortBy === "price") {

            sortOptions[
                "mentorProfile.pricing"
            ] = order === "desc"
                ? -1
                : 1
            }

        if (sortBy === "rating") {

            sortOptions[
                 "mentorProfile.avgRating"
            ] = order === "desc"
                ? -1
                : 1
            }

         if (sortBy === "experience") {

            sortOptions[
                "mentorProfile.experience"
            ] = order === "desc"
                ? -1
                : 1
            }

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 9
        const skip = (page - 1) * limit
        const totalMentors = await User.countDocuments(query)
        const mentors = await User.find(query)
        .select("-password -refreshToken")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                mentors,
                currentPage: page,
                totalPages:Math.ceil(totalMentors/limit),
                totalMentors
                },
                "Mentors fetched successfully"
            )
        )
})

export {
    getSingleMentor,
    getAllMentors,
}
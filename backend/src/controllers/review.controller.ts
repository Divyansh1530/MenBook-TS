import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const calculateMentorRating = async (mentorId:string):Promise<void> => {

    const reviews = await Review.find({
        mentorId
    })

    if (reviews.length === 0) {

        await User.findByIdAndUpdate(
            mentorId,
            {
                $set: {
                    "mentorProfile.avgRating": 0
                }
            }
        )

        return
    }

    const totalRating = reviews.reduce(
        (acc, curr) => acc + curr.rating,0
    )

    const avgRating = totalRating / reviews.length

    await User.findByIdAndUpdate(
        mentorId,
        {
            $set: {
                "mentorProfile.avgRating": Number(
                    avgRating.toFixed(1)
                )
            }
        }
    )
}

interface CreateReviewBody {
    mentorId:string;
    bookingId:string;
    rating:number;
    comment:string;
}

const createReview = asyncHandler(async(req,res) => {

    const {mentorId , bookingId , rating , comment} = req.body as CreateReviewBody

    const userId = req.user!._id.toString()

    if (req.user!.role !== "user") {
        throw new ApiError(403,"Only Users can create reviews")
    }

    if (!mentorId || !bookingId || !rating) {
        throw new ApiError(400,"All Fields are required")
    }

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new ApiError(400,"Invalid Mentor Id")
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400,"Invalid Booking Id")
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400,"Rating must lie between 1 and 5")
    }

    const booking = await Booking.findById(
        bookingId
    )

    if (!booking) {
        throw new ApiError(404,"Booking not found")
    }

    if (booking.userId.toString() !== userId.toString()) {
        throw new ApiError(403,"You are not allowed to review this booking")
    }

    if (booking.mentorId.toString() !== mentorId.toString()) {
        throw new ApiError(400,"Mentor does not match booking")
    }

    const now = new Date();

    if (booking.endTime > now) {
        throw new ApiError(400,"You can review this session only after it has ended.");
    }

    if (booking.status !== "completed") {
        booking.status = "completed";
        booking.expiresAt = null;
        await booking.save();
    }

    const existingReview = await Review.findOne({
        bookingId
    })

    if (existingReview) {
        throw new ApiError(409,"Review already submitted")
    }

    const review = await Review.create({
        userId,
        mentorId,
        bookingId,
        rating,
        comment
    })

    await calculateMentorRating(
        review.mentorId.toString() 
    )

    return res
    .status(201)
    .json(
        new ApiResponse(201,review,"Review created successfully")
    )

})

const getMentorReviews = asyncHandler(async(req,res) => {

    const mentorId = req.params.mentorId as string

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new ApiError(400,"Invalid Mentor Id")
    }

    const mentor = await User.findById(mentorId)

    if (!mentor) {
        throw new ApiError(404,"Mentor Not Found")
    }

    if (mentor.role !== "mentor") {
        throw new ApiError(400,"User is not a mentor")
    }

    const reviews = await Review.find({
        mentorId
    })
    .populate({
        path:"userId",
        select:"name avatar"
    })
    .sort({
        createdAt:-1
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,reviews,"Mentor reviews fetched successfully")
    )

})

interface UpdateReviewBody {
    rating:number;
    comment:string;
}

const updateReview = asyncHandler(async(req,res) => {
  
    const reviewId = req.params.reviewId as string
    const {rating , comment} = req.body as UpdateReviewBody

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ApiError(400,"Invalid Review Id")
    }

    const review = await Review.findById(reviewId)

    if (!review) {
        throw new ApiError(404,"Review not found")
    }

    if (review.userId.toString() !== req.user!._id.toString()) {
        throw new ApiError(403,"Unauthorized")
    }

    if (rating && (rating<1 || rating>5)) {
        throw new ApiError(400,"Rating must lie between 1 to 5")
    }

    if (rating !== undefined) {
        review.rating = rating
    }

    if (comment !== undefined) {
        review.comment = comment
    }

    await review.save()
    
    await calculateMentorRating(
        review.mentorId.toString()
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,review,"Review updated successfully")
    )

})

const deleteReview = asyncHandler(async(req,res) => {

    const reviewId = req.params.reviewId as string

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ApiError(400,"Invalid reviewId")
    }

    const review = await Review.findById(reviewId)

    if (!review) {
        throw new ApiError(404,"Review Not Found")
    }

    if (review.userId.toString() !== req.user!._id.toString()) {
        throw new ApiError(403,"Unauthorized")
    }

    await Review.deleteOne({
        _id:reviewId
    })

    await calculateMentorRating(
        review.mentorId.toString()
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Review deleted successfully")
    )

})

export {
    calculateMentorRating,
    createReview,
    getMentorReviews,
    updateReview,
    deleteReview
}
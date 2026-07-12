import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import { Review } from "../models/review.model.js";

interface BookingBody {
    mentorId:string;
    startTime:number;
    endTime:number;
}

const createBooking = asyncHandler(async(req,res) => {

    const {mentorId , startTime , endTime } = req.body as BookingBody

    const userId = req.user!._id.toString()

    if (req.user!.role !== "user") {
        throw new ApiError(403,"Only Users can create bookings")
    }

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new ApiError(400,"Invalid Mentor ID")
    }

    if (!mentorId || !startTime || !endTime) {
        throw new ApiError(400,"All Fields are required")
    }

    const mentor = await User.findById(mentorId)    

    if (!mentor) {
        throw new ApiError(404,"Mentor Not Found")
    }

    if (mentor.role !== "mentor") {
        throw new ApiError(400,"Selected User is not a mentor")
    }

    const parsedStartTime = new Date(startTime)
    const parsedEndTime = new Date(endTime)

    const now = new Date()

    if (parsedStartTime <= now) {
        throw new ApiError(400,"Cannot book past time slots")
    }

    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
        throw new ApiError(400,"Invalid Date Format")
    }

    if (parsedStartTime >= parsedEndTime) {
        throw new ApiError(400,"Start Time must be less than End Time")
    }

    await Booking.deleteMany({
        status: "pending",
        expiresAt: {
            $lte: new Date()
        }
     });

    const existingBooking = await Booking.findOne({
        mentorId,
        startTime:parsedStartTime,
        $or:[
            {
                status:"confirmed"
            },
            {
                status:"pending",
                expiresAt:{
                    $gt:new Date()
                }
            }
        ]
    })

    if (existingBooking) {
        throw new ApiError(409,"Slot is already Booked")
    }
    
    if (mentor.mentorProfile?.pricing == null) {
        throw new ApiError(400,"Mentor pricing not found")
    }

    const bookingDate = new Date(parsedStartTime)
    bookingDate.setHours(0,0,0,0)

    const booking = await Booking.create({
        userId,
        mentorId,
        startTime:parsedStartTime,
        endTime:parsedEndTime,
        bookingDate,
        amount:mentor.mentorProfile.pricing,
        status:"pending",
        paymentStatus:"pending",
        expiresAt:new Date(Date.now() + 10 * 60 * 1000)
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,booking,"Booking created successfully")
    )

})

const getUserBookings = asyncHandler(async(req,res) => {

    const userId = req.user!._id.toString()

    const bookings = await Booking.find({
        userId
    })
    .populate({
        path:"mentorId",
        select:"name email avatar mentorProfile"
    })
    .sort({ startTime:1 })

    const bookingsWithReviews = await Promise.all(
    bookings.map(async (booking) => {

        const review = await Review.findOne({
            bookingId: booking._id
        }).select("rating comment");

        return {
            ...booking.toObject(),
            review
        };
    })
);

    return res
    .status(200)
    .json(
        new ApiResponse(200,bookingsWithReviews,"User Bookings fetched successfully")
    )

})

const getMentorBookings = asyncHandler(async(req,res) => {

    if (req.user!.role !== "mentor") {
        throw new ApiError(403,"Only Mentors can access Mentor Bookings")
    }

    const mentorId = req.user!._id.toString()

    const bookings = await Booking.find({
        mentorId
    })
    .populate({
        path:"userId",
        select:"name email avatar"
    })
    .sort({ startTime:1 })

    return res
    .status(200)
    .json(
        new ApiResponse(200,bookings,"Mentor Bookings has been fetched successfully")
    )

})

const cancelBooking = asyncHandler(async(req,res) => {

    const bookingId = req.params.bookingId as string

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400,"Invalid booking id")
    }

    const booking = await Booking.findById(bookingId)

    if (!booking) {
        throw new ApiError(404,"Booking Not Found")
    }

    const isMentorOwner = booking.mentorId.toString() == req.user!._id.toString()
    const isUserOwner = booking.userId.toString() == req.user!._id.toString()

    if (!isUserOwner && !isMentorOwner) {
        throw new ApiError(403,"You are not allowed to cancel this booking")
    }

    if (booking.status === "cancelled") {
        throw new ApiError(400,"Booking is already cancelled")
    }

    booking.status = "cancelled"
    booking.expiresAt = null

    await booking.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,null,"Booking cancelled successfully")
    )
})

export {
    createBooking,
    getUserBookings,
    getMentorBookings,
    cancelBooking, 
}
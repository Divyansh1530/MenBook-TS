import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Availability } from '../models/availability.model.js'
import mongoose from "mongoose"
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import generateSlots from "../utils/generateSlots.js";

interface AvailabilityBody {
    dayOfWeek:number;
    startTime:number | string;
    endTime:number | string;
    slotDuration:number | string;
    bufferTime?:number| string;
}

const createAvailabilty = asyncHandler(async (req, res) => {

    const {dayOfWeek , startTime , endTime , slotDuration , bufferTime = 0} = req.body as AvailabilityBody

    const mentorId = req.user._id.toString()

    if (req.user.role !== "mentor") {
        throw new ApiError(403,"Only mentors can create availability")
    }

    if (dayOfWeek === undefined || startTime === undefined || endTime === undefined || slotDuration === undefined) {
        throw new ApiError(400,"Required fields are missing")
    }

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new ApiError(400,"Invalid mentor ID")
    }

    const parsedStartTime = Number(startTime)

    const parsedEndTime = Number(endTime)

    const parsedSlotDuration = Number(slotDuration)

    const parsedBufferTime = Number(bufferTime)

    if (isNaN(parsedStartTime) || isNaN(parsedEndTime) || isNaN(parsedSlotDuration) || isNaN(parsedBufferTime)) {
        throw new ApiError(400, "Invalid numeric values")
    }

    if (parsedStartTime >= parsedEndTime) {
        throw new ApiError(400,"Start time must be less than end time")
    }

    if (parsedSlotDuration <= 0) {
        throw new ApiError(400,"Slot duration must be greater than 0")
    }

    const totalWindow = parsedEndTime - parsedStartTime

    if (parsedSlotDuration > totalWindow) {
        throw new ApiError(400,"Slot duration exceeds availability window")
    }

    if (parsedStartTime < 0 || parsedEndTime > 1440) {
        throw new ApiError(400,"Invalid time range")
    }

    if (parsedBufferTime < 0) {
        throw new ApiError(400,"Buffer time cannot be negative")
    }

    const overlappingAvailability = await Availability.findOne({
                mentorId,
                dayOfWeek,
                startTime: {
                    $lt: parsedEndTime
                },
                endTime: {
                    $gt: parsedStartTime
                }
            })

        if (overlappingAvailability) {
            throw new ApiError(409,"Availability window overlaps with existing schedule")
        }

    const availability = await Availability.create({
            mentorId,
            dayOfWeek,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            slotDuration: parsedSlotDuration,
            bufferTime: parsedBufferTime,
            isBlocked: false
        })

    return res
    .status(201)
    .json(
        new ApiResponse(201,availability,"Availability created successfully")
    )
})

export {
    createAvailabilty
}
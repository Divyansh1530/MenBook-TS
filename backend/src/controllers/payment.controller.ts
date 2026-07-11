import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Payment } from "../models/payment.model.js";
import razorpay from "../utils/razorpay.js";
import crypto from 'crypto'
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import { bookingConfirmationTemplate, mentorBookingTemplate } from "../templates/email.js";

const createOrder = asyncHandler(async(req,res) => {

    const bookingId = req.body.bookingId as string

    const userId = req.user!._id.toString()

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400,"Invalid Booking Id")
    }

    const booking = await Booking.findById(bookingId)

    if (!booking) {
        throw new ApiError(404,"Booking not found")
    }

    if (booking.userId.toString() !== userId.toString()) {
        throw new ApiError(403,"You are not allowed to pay for this booking")
    }

    if (booking.paymentStatus === "paid" ) {
        throw new ApiError(400,"Booking is already paid")
    }

    const amountInPaise = booking.amount * 100

    const order = await razorpay.orders.create({
        amount:amountInPaise,
        currency:"INR",
        receipt:`receipt_${booking._id}`
    })

    const payment = await Payment.create({
        mentorId:booking.mentorId,
        userId:booking.userId,
        bookingId:booking._id,
        amount:booking.amount,
        status:"pending",
        provider:"razorpay",
        orderId:order.id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,{order,payment},"Razorpay order created successfully")
    )

})

interface VerifyPaymentBody {
    razorpay_order_id:string;
    razorpay_payment_id:string;
    razorpay_signature:string;
}

const verifyPayment = asyncHandler(async(req,res) => {

    const {razorpay_order_id , razorpay_payment_id , razorpay_signature} = req.body as VerifyPaymentBody

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400,"All payment fields are required")
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto.createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET!
        )
        .update(body.toString())
        .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
        throw new ApiError(400,"Invalid Payment Signature")
    }

    const payment = await Payment.findOne({
        orderId: razorpay_order_id
    })

    if (!payment) {
        throw new ApiError(404,"Payment record not found")
    }

    if (payment.status === "paid") {
        throw new ApiError(400,"Payment already verified")
    }

    payment.status = "paid"

    payment.paymentId = razorpay_payment_id

    payment.signature = razorpay_signature

    await payment.save()

    const booking = await Booking.findById(
        payment.bookingId
    )

    if (!booking) {
        throw new ApiError(404,"Booking not found")
    }

    booking.status = "confirmed"

    booking.expiresAt = null

    booking.paymentStatus = "paid"

    booking.meetingLink = `https://meet.jit.si/menbook-${booking._id}`

    await booking.save()

    const user = await User.findById(
            booking.userId
        )
    if (!user) {
        throw new ApiError(404,"User Not Found")
    }

    const mentor = await User.findById(
            booking.mentorId
        )
    if (!mentor) {
        throw new ApiError(404,"Mentor Not Found")
    }

    await sendEmail({

        to: user.email,

        subject: "Booking Confirmed",

        html: bookingConfirmationTemplate({
            mentorName:mentor.name,
            meetingLink:booking.meetingLink,
            sessionTime:new Date(
                booking.startTime
            ).toLocaleDateString()
        })
    })

    await sendEmail({

        to: mentor.email,

        subject: "New Session Booked",

        html: mentorBookingTemplate({
            userName:user.name,
            meetingLink:booking.meetingLink
        })
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    payment,
                    booking
                },
                "Payment verified successfully"
            )
        )
})


export {
    createOrder,
    verifyPayment
}
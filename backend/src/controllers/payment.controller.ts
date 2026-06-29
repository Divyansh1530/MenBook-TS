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

        html: `
           <div style="max-width:600px;margin:auto;padding:40px;font-family:Arial,sans-serif;background:#fdfaf3;border-radius:24px;border:1px solid #e5e5e5;color:#1a1a1a;">
        
            <h1 style="font-size:32px;line-height:1.2;margin-bottom:20px;">
                Your session starts soon.
            </h1>

            <p style="font-size:16px;line-height:1.7;color:#555;margin-bottom:30px;">
                You have an upcoming session scheduled with 
                <strong>${mentor.name}</strong>.
            </p>

            <div style="background:white;padding:24px;border-radius:20px;border:1px solid #eee;margin-bottom:30px;">

                <p style="margin:0 0 14px 0;font-size:14px;color:#777;">
                Mentor
                </p>

                <p style="margin:0 0 24px 0;font-size:20px;font-weight:600;color:#1a1a1a;">
                ${mentor.name}
                </p>

                <p style="margin:0 0 14px 0;font-size:14px;color:#777;">
                Session Time
                </p>

                <p style="margin:0;font-size:18px;font-weight:500;color:#1a1a1a;">
                ${new Date(booking.startTime).toLocaleString()}
                </p>

            </div>

            <a 
                href="${booking.meetingLink}"
                style="
                display:inline-block;
                background:#120f0a;
                color:white;
                text-decoration:none;
                padding:14px 28px;
                border-radius:999px;
                font-size:15px;
                font-weight:600;
                "
            >
                Join Meeting
            </a>

            <p style="margin-top:40px;font-size:13px;color:#999;line-height:1.7;">
                Join a few minutes early to avoid connection issues.
            </p>

            </div>
            </p>
        `
    })

    await sendEmail({

        to: mentor.email,

        subject: "New Session Booked",

        html: `
            <h1>
                New Booking
            </h1>

            <p>
                A new user booked
                a session with you.
            </p>

            <p>
                User:
                ${user.name}
            </p>

            <p>
                Meeting Link:
                <a href="${booking.meetingLink}">
                    Join Meeting
                </a>
            </p>
        `
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

const razorpayWebhook = asyncHandler(async(req,res) => {

    const razorpaySignature = req.headers["x-razorpay-signature"]

    if (!razorpaySignature) {
        throw new ApiError(400,"Webhook signature is missing")
    }

    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(req.body)
    .digest("hex")

    const isAuthentic = expectedSignature === razorpaySignature

    if (!isAuthentic) {
        throw new ApiError(400,"Invalid Webhook Signature")
    }

    const payload = JSON.parse(
        req.body.toString()
    )

    if (payload.event === "payment.captured") {
        
        const paymentEntity = payload.payload.payment.entity
        const razorpayOrderId = paymentEntity.order_id
        const razorpayPaymentId = paymentEntity.id
        
        const payment = await Payment.findOne({
            orderId:razorpayOrderId
        })

        if (!payment) {
            return res
            .status(404)
            .json({
                success:false,
                message:"Payment record not found"
            })
        }
        if (payment.status === "paid") {
            return res
            .status(200)
            .json({
                success:true,
                message:"Webhook already processed"
            })
        }
        payment.status = "paid"
        payment.paymentId = razorpayPaymentId

        await payment.save()

        const booking = await Booking.findById(payment.bookingId)

        if (booking) {
            booking.status = "confirmed"
            booking.paymentStatus = "paid"
            booking.expiresAt=null
            
            await booking.save()
        }
    }
    return res
    .status(200)
    .json({
        success:true,
        message:"Webhook received successfully"
    })

})

export {
    createOrder,
    verifyPayment,
    razorpayWebhook
}
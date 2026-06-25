import { Router } from "express";
import {
    createOrder,
    verifyPayment
} from '../controllers/payment.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { paymentLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router()

router.route("/create-order").post(verifyJWT,createOrder)
router.route("/verify-payment").post(verifyJWT,verifyPayment)

export default router
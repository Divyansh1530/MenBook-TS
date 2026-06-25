import { Router } from "express";
import {
    createReview,
    deleteReview,
    getMentorReviews,
    updateReview
} from '../controllers/review.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { reviewLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT,createReview)
router.route("/mentors/:mentorId").get(getMentorReviews)
router.route("/:reviewId").patch(verifyJWT,updateReview)
router.route("/:reviewId").delete(verifyJWT,deleteReview)

export default router
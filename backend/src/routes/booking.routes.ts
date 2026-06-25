import { Router } from "express";
import{
    cancelBooking,
    createBooking,
    getMentorBookings,
    getUserBookings,
    markBookingComplete,
} from "../controllers/booking.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT , createBooking)
router.route("/user-bookings").get(verifyJWT,getUserBookings)
router.route("/mentor-bookings").get(verifyJWT,getMentorBookings)
router.route("/:bookingId/cancel").patch(verifyJWT,cancelBooking)
router.route("/:bookingId/complete").patch(verifyJWT,markBookingComplete)


export default router
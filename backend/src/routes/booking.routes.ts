import { Router } from "express";
import{
    cancelBooking,
    createBooking,
    getMentorBookings,
    getUserBookings,
} from "../controllers/booking.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT , createBooking)
router.route("/user-bookings").get(verifyJWT,getUserBookings)
router.route("/mentor-bookings").get(verifyJWT,getMentorBookings)
router.route("/:bookingId/cancel").patch(verifyJWT,cancelBooking)


export default router
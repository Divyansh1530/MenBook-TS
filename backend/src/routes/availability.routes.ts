import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createAvailabilty, deleteAvailability, getAvailableSlots, getCurrentMentorAvailability, getMentorAvailability, updateAvailability } from "../controllers/availability.controller.js";

const router = Router()

router.route("/create").post(verifyJWT,createAvailabilty)
router.route("/:mentorId").get(getMentorAvailability)
router.route("/:availabilityId").patch(verifyJWT,updateAvailability)
router.route("/:availabilityId").delete(verifyJWT,deleteAvailability)
router.route("/slots/:mentorId").get(verifyJWT,getAvailableSlots)
router.route("/mentor").get(verifyJWT,getCurrentMentorAvailability)

export default router
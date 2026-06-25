import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createAvailabilty } from "../controllers/availability.controller.js";

const router = Router()

router.route("/create").post(verifyJWT,createAvailabilty)

export default router
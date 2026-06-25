import {Router} from 'express'
import {
    loginUser,
    logoutUser,
    registerUser,
} from '../controllers/user.controller.js'
import {
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
} from '../controllers/profile.controller.js'
import {
    getAllMentors,
    getSingleMentor,
} from '../controllers/mentor.controller.js'

import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/register").post(upload.single("avatar"),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-details").patch(verifyJWT,updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/mentors/:id").get(getSingleMentor)
router.route("/mentors").get(getAllMentors)

export default router
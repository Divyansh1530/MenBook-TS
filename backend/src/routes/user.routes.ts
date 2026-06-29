import {Router} from 'express'
import {
    loginUser,
    logoutUser,
    registerUser,
    googleAuthCallback
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
import type { Request, Response , NextFunction } from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import passport from 'passport'


const router = Router()

router.route("/register").post(upload.single("avatar"),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/change-password").patch(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-details").patch(verifyJWT,updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/mentors/:id").get(getSingleMentor)
router.route("/mentors").get(getAllMentors)
router.get(

  "/auth/google",

  (req:Request, res:Response, next:NextFunction) => {

    const role = typeof req.query.role === "string"? req.query.role : "user"

    passport.authenticate(
      "google",
      {
        scope: ["profile", "email"],
        state: role
      }
    )(req, res, next)
  }
)
router.get("/auth/google/callback",passport.authenticate(
    "google",
    {
        session:false
    }
  ),
   googleAuthCallback
)

router.get("/auth/google/login", passport.authenticate("google", 
    {
      scope: ["profile", "email"],
      state: "login"
    }
  )
)

router.get("/auth/google/signup",(req:Request, res:Response, next:NextFunction) => {

    const role = typeof req.query.role === "string"? req.query.role : "user"

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: `signup:${role}`
    })(req, res, next)

  }
)


export default router
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import type { Profile, VerifyCallback } from "passport-google-oauth20"
import type { Request } from "express"
import { User } from "../models/user.model.js"
import type { UserDocument } from "../models/user.model.js"
    
interface GoogleUserData {
    name:string;
    email:string;
    googleId:string;
    avatar:string;
    role:"user" | "mentor";
    isProfileComplete:boolean;

        mentorProfile?:{
            title:string;
            bio:string;
            expertise:string[];
            pricing:number;
        }
}

type UserDocumentWithRedirect = UserDocument & {
    oauthRedirect?:string;
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!,
            callbackURL: process.env.CALLBACK_URL!,
            passReqToCallback: true
        },

        async (
            req: Request,
            _accessToken: string,
            _refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {

                const state = typeof req.query.state === "string" ? req.query.state : "login"

                const isSignup =state.startsWith("signup:")

                const role: "user" | "mentor" =
                    isSignup
                        ? (state.split(":")[1] as "user" | "mentor")
                        : "user"

                const email = profile.emails?.[0]?.value

                if (!email) {
                    return done(
                        new Error("Google account has no email"),
                        undefined
                    )
                }

                let user = await User.findOne({
                    email
                }) as UserDocumentWithRedirect

                if (user) {

                    if (!user.googleId) {
                        user.googleId = profile.id
                        await user.save()
                    }

                    if (isSignup) {
                        return done(
                            new Error(
                                "An account with this email already exists"
                            ),
                            undefined
                        )
                    }

                    user.oauthRedirect =
                        user.role === "mentor" &&
                        !user.isProfileComplete
                            ? "/mentor-onboarding"
                            : "/"

                    return done(null, user)
                }

                const userData: GoogleUserData = {
                    name: profile.displayName,
                    email,
                    googleId: profile.id,
                    avatar: profile.photos?.[0]?.value ?? "",
                    role,
                    isProfileComplete: role !== "mentor"
                }

                if (role === "mentor") {
                    userData.mentorProfile = {
                        title: "",
                        bio: "",
                        expertise: [],
                        pricing: 0
                    }
                }

                const createdUser = await User.create(userData) as UserDocumentWithRedirect

                createdUser.oauthRedirect =
                    role === "mentor"
                        ? "/mentor-onboarding"
                        : "/"

                return done(null, createdUser)

            } catch (error: unknown) {

                if (error instanceof Error) {
                    return done(error, undefined)
                }

                return done(
                    new Error("Unknown error"),
                    undefined
                )
            }
        }
    )
)

export default passport
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {User} from '../models/user.model.js' 
import jwt from "jsonwebtoken"
import type { CookieOptions } from "express";
import type { UserDocument } from "../models/user.model.js";

type TokenResponse = {
    refreshToken:string;
    accessToken:string;
}

const generateAccessAndRefreshTokens = async(userId:string):Promise<TokenResponse> => {
    try {
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not Found")
    }
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({
        validateBeforeSave:false
    })
    return {
        accessToken,
        refreshToken
    }
    } catch {
        //
    }
    throw new ApiError(500,"Failed to generate tokens")

}

type Role = "user" | "mentor"

interface RegisterUserBody {
    name:string;
    email:string;
    password:string;
    role?:Role;
    title?:string;
    bio?:string;
    expertise?:string;
    pricing?:string;
}

type UserData = {
    name:string;
    email:string;
    password:string;
    role:Role;
    avatar:string;

    mentorProfile?:{
        title:string;
        bio:string;
        expertise:string[];
        pricing:number
    }
}

const registerUser = asyncHandler(async(req,res) => {
    const { name , email , password , role , title , bio , expertise , pricing } = req.body as RegisterUserBody

    if (
        [email, name, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const allowedRoles:Role[] = ["user", "mentor"]

    if (role && !allowedRoles.includes(role)) {
        throw new ApiError(400, "Invalid role")
    }

    const existedUser = await User.findOne({
        email 
    })

    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const avatarLocalPath = req.file?.path;

    const avatar = await uploadOnCloudinary(avatarLocalPath || "" )

    const userData:UserData = {
        name ,
        avatar: avatar?.url || "",
        email: email.toLowerCase(),
        password,
        role: role || "user"
    }
    
    if (role === "mentor") {
        if (
            !title ||
            !bio ||
            !expertise ||
            !pricing
        ) {
            throw new ApiError(400,"All mentor fields are required")
        }
        
        let parsedExpertise:string[] = []
        
        try {
            if (expertise) {
                parsedExpertise = JSON.parse(expertise)
            }
        } catch (error) {
            throw new ApiError(400,"Invalid expertise format")
        }
        
        const parsedPricing = Number(pricing)
    
            if (isNaN(parsedPricing) || parsedPricing < 0) {
                throw new ApiError(400, "Invalid pricing")
            }
            
        
        userData.mentorProfile = {
            title,
            bio,
            expertise: parsedExpertise,
            pricing:parsedPricing
        }
    }

    const user = await User.create(userData)
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )


})

interface LoginUserBody {
    email:string;
    password:string;
}

const loginUser = asyncHandler(async(req,res) => {

    const {email, password} = req.body as LoginUserBody

    if (!email) {
        throw new ApiError(400, "email is required")
    }
    
    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id.toString())

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options:CookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
    req.user!._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    const options:CookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})

interface RefreshTokenBody {
    refreshToken?:string;
}

interface JwtPayload {
    _id:string;
}

const refreshAccessToken = asyncHandler(async(req,res) => {
    const {refreshToken} = req.body as RefreshTokenBody

    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as JwtPayload
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (refreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options:CookieOptions = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken : newRefreshToken} = await generateAccessAndRefreshTokens(user._id.toString())
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error:unknown) {
        if (error instanceof Error) {
            throw new ApiError(401, error?.message || "Invalid refresh token")
        }
    }

})

type UserDocumentWithRedirect = UserDocument & {
    oauthRedirect?: string;
};

const googleAuthCallback =asyncHandler(async (req, res) => {

        const user = req.user as UserDocumentWithRedirect

        if (!user) {
            throw new ApiError(404,"User not found")
        }

        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({
            validateBeforeSave: false
        })

        const options:CookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }

        const redirect = user.oauthRedirect ||
        (
            user.role === "mentor" &&
            !user.isProfileComplete
            ? "/mentor-onboarding"
            : "/"
        )

        return res
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",refreshToken,options)
        .redirect(
            `${process.env.CORS_ORIGIN}${redirect}`
        )
  
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    googleAuthCallback
}
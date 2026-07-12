import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {User} from '../models/user.model.js' 

interface PasswordBody {
    oldPassword:string;
    newPassword:string;
}

const changeCurrentPassword = asyncHandler(async(req,res) => {
    const {oldPassword , newPassword} = req.body as PasswordBody

    const user = await User.findById(req.user?._id)

    if (!user) {
      throw new ApiError(404,"User not found")
    }

    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400,"Invalid old password")
    }

    user.password = newPassword

    if (newPassword.length<8) {
      throw new ApiError(401,"Password should have minimum 8 char")
    }

    await user?.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password changed successfully")
    )

})

const getCurrentUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user!._id)
    .select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const userData = {
        ...user.toObject(),
        hasPassword: Boolean(user.password)
    }

    return res.status(200).json(
        new ApiResponse(200,userData,"Current user fetched successfully")
      )
    })

interface AccountBody {
    name:string;
    title:string;
    bio:string;
    expertise:string[];
    pricing:string;
    experience:string;
    linkedin:string;
    portfolio:string;
}

const updateAccountDetails = asyncHandler(async(req,res) => {
    const {name , title , bio , expertise , pricing , experience , linkedin , portfolio} = req.body as AccountBody

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    if (name !== undefined) {
      user.name = name.trim()
    }

    if (user.role === "mentor") {

      if (!user.mentorProfile) {
        user.mentorProfile = {}
      }

      if (title !== undefined) {
        user.mentorProfile.title = title
      }

      if (bio !== undefined) {
        user.mentorProfile.bio = bio
      }

      
      if (expertise !== undefined) {

        if (!Array.isArray(expertise)) {
            throw new ApiError(400, "Expertise must be array")
        } 
        user.mentorProfile.expertise = expertise
      }

      if (pricing !== undefined) {

        const parsedPricing = Number(pricing)

        if (isNaN(parsedPricing) || parsedPricing < 0) {
            throw new ApiError(400, "Invalid pricing")
        }
        user.mentorProfile.pricing = parsedPricing
      }
        
      if (experience !== undefined) {
        user.mentorProfile.experience = experience
      }

      if (linkedin !== undefined) {
        user.mentorProfile.linkedin = linkedin
      }

      if (portfolio !== undefined) {
        user.mentorProfile.portfolio = portfolio
      }

    }

    await user.save()

    const updatedUser = await User.findById(user._id).select(
        "-password -refreshToken"
      )

    return res
      .status(200)
      .json(
        new ApiResponse( 200, updatedUser,"Account details updated successfully")
      )
})

const updateUserAvatar = asyncHandler(async(req,res) => {
     const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar?.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

export {
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    getCurrentUser
}
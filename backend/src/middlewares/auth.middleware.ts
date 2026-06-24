import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from '../models/user.model.js'

interface JwtPayload {
    _id:string;
}

export const verifyJWT = asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error:unknown) {
        if (error instanceof Error) {
            throw new ApiError(401, error?.message || "Invalid access token")   
        }
    }
})

declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

export {}
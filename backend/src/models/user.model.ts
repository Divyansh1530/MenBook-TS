import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'
import type { HydratedDocument } from "mongoose";

interface MentorProfile {
    title?:string;
    bio?:string;
    expertise?:string[];
    pricing?:number;
    avgRating?:number;
    totalReviews?:number;
    experience?:string;
    linkedin?:string;
    portfolio?:string;
}

interface UserMethods {
    isPasswordCorrect(password:string):Promise<boolean>
    generateAccessToken():string
    generateRefreshToken():string
}

interface User {
    name:string;
    email:string;
    password?:string;
    avatar?:string;
    timezone:string;
    role:"user" | "mentor" | "admin";
    phone?:string;
    mentorProfile?:MentorProfile;
    refreshToken?:string;
    googleId?:string;
    isProfileComplete?:boolean;
    createdAt?:Date;
    updatedAt?:Date;
}

const userSchema = new Schema<User,mongoose.Model<User>, UserMethods>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:false
    },
    avatar:{
        type:String,
    },
    timezone:{
        type:String,
        default:"UTC"
    },
    role:{
        type:String,
        enum:["user","mentor","admin"],
        default:"user"
    },
    phone:{
        type:String
    },
    mentorProfile:{
        title:{
            type:String
        },
        bio:{
            type:String,
        },
        expertise:[
            {
            type:String
        }
        ],
        pricing:{
            type:Number,
        },
        avgRating:{
            type:Number,
            default:0
        },
        totalReviews:{
            type:Number,
            default:0
        },
        experience:{
            type:String
        },
        linkedin:{
            type:String
        },
        portfolio:{
            type:String
        }

    },
    refreshToken:{
        type:String
    },
    googleId:{
        type:String
    },
    isProfileComplete:{
        type:Boolean,
        default:true
    }
},

{
    timestamps:true
}
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    this.password! = await bcrypt.hash(this.password!, 10)
})      

userSchema.methods.isPasswordCorrect = async function(password: string): Promise<boolean> {
        return await bcrypt.compare(
            password,
            this.password!
        )
    }

userSchema.methods.generateAccessToken = function():string{
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY!
        } as SignOptions
    )
}

userSchema.methods.generateRefreshToken = function():string{
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY!
        }as SignOptions
    )
    
}
export type UserDocument = HydratedDocument<User, UserMethods>

export const User = mongoose.model("User",userSchema)
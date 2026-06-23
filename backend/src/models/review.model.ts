import mongoose , {Schema} from "mongoose";

interface Review {
    userId:mongoose.Types.ObjectId;
    mentorId:mongoose.Types.ObjectId;
    bookingId:mongoose.Types.ObjectId;
    rating:number;
    comment?:string;
    createdAt?:Date;
    updatedAt?:Date;
}

const reviewSchema = new Schema<Review>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    mentorId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    bookingId:{
        type:Schema.Types.ObjectId,
        ref:"Booking",
        required:true,
        unique:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        trim:true,
        maxlength:500
    }
},
{ 
    timestamps:true 
}
)

export const Review = mongoose.model("Review" , reviewSchema)

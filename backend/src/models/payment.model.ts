import mongoose , {Schema} from "mongoose";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

type Provider = "razorpay"

interface Payment {
    mentorId:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    bookingId:mongoose.Types.ObjectId;
    amount:number;
    status?:PaymentStatus;
    provider?:Provider;
    paymentId?:string | null;
    orderId?:string | null;
    signature?:string | null;
    createdAt?:Date;
    updatedAt?:Date;
}

const paymentSchema = new Schema<Payment>({
    mentorId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    bookingId:{
        type:Schema.Types.ObjectId,
        ref:"Booking",
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["pending" , "paid" , "failed" , "refunded"],
        default:"pending"
    },
    provider:{
        type:String,
        enum:["razorpay"],
        default:"razorpay"
    },
    paymentId:{
        type:String,
        default:null,
        unique:true,
        sparse:true
    },
    orderId:{
        type:String,
        default:null,
        unique:true,
        sparse:true
    },
    signature:{
        type:String,
        default:null
    }
},
{
    timestamps:true
}
)
paymentSchema.index(
    {bookingId:1},
    {unique:true}
)
paymentSchema.index(
    {paymentId:1},
    {unique:true,sparse:true}
)
paymentSchema.index(
    {orderId:1},
    {unique:true,sparse:true}
)

export const Payment = mongoose.model("Payment" , paymentSchema)
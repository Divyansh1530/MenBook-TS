import mongoose , {Schema} from "mongoose";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"

type PaymentStatus = "pending" | "paid" | "cancelled"

interface Booking {
    userId:mongoose.Types.ObjectId;
    mentorId:mongoose.Types.ObjectId;
    startTime:number;
    endTime:number;
    status?:BookingStatus;
    paymentStatus?:PaymentStatus;
    amount:number;
    meetingLink?:string | null;
    cancelReason?:string | null;
    expiresAt?:Date
    reminderSent?:boolean
    createdAt?:Date
    updatedAt?:Date
}

const bookingSchema = new Schema<Booking>({
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
    startTime:{
        type:Number,
        required:true
    },
    endTime:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","confirmed","cancelled","completed"],
        default:"pending"
    },
    paymentStatus:{
        type:String,
        enum:["pending","paid","cancelled"],
        default:"pending"
    },
    amount:{
        type:Number,
        required:true
    },
    meetingLink:{
        type:String,
        default:null
    },
    cancelReason:{
        type:String,
        default:null
    },
    expiresAt:{
        type:Date
    },
    reminderSent:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
}
) 

export const Booking = mongoose.model("Booking",bookingSchema)
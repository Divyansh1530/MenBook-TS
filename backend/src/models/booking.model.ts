import mongoose , {Schema} from "mongoose";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"

type PaymentStatus = "pending" | "paid" | "cancelled"

interface Booking {
    userId:mongoose.Types.ObjectId;
    mentorId:mongoose.Types.ObjectId;
    startTime:Date;
    endTime:Date;
    status?:BookingStatus;
    paymentStatus?:PaymentStatus;
    amount:number;
    meetingLink?:string | null;
    cancelReason?:string | null;
    expiresAt?:Date | null;
    reminderSent?:boolean
    bookingDate:Date
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
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
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
    bookingDate: {
        type: Date,
        required: true
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
        type:Date,
        default:null
    },

},
{
    timestamps:true
}
)
 
bookingSchema.index(
    { mentorId:1 , startTime:1 },
    { unique:true }
)

export const Booking = mongoose.model("Booking",bookingSchema)
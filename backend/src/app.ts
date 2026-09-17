import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from './config/passport.js'
import session from 'express-session'
import { ApiError } from './utils/ApiError.js'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(
   session({
      secret: process.env.SESSION_SECRET || "oauthsecret",
      resave: false,
      saveUninitialized: false
   })
)
app.use(passport.initialize())
app.use(passport.session())

//routes import
import userRouter from './routes/user.routes.js'
import availabilityRouter from './routes/availability.routes.js'
import bookingRouter from './routes/booking.routes.js'
import paymentRouter from './routes/payment.routes.js'
import reviewRouter from './routes/review.routes.js'

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/availability",availabilityRouter)
app.use("/api/v1/booking",bookingRouter)
app.use("/api/v1/payment",paymentRouter)
app.use("/api/v1/review",reviewRouter)

// global error handling middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    const message = err instanceof Error ? err.message : "Internal Server Error";
    return res.status(500).json({
        statusCode: 500,
        success: false,
        message,
        errors: []
    });
});

export {app}
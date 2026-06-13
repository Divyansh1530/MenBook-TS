import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'

const connectDB = async():Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(
            `\n MongoDB connected successfully, DB HOST:${connectionInstance.connection.host}`
        )

    } catch (error:unknown) {
        if (error instanceof Error) {
            console.log("MongoDB connection failed",error.message)
        }
    }
    process.exit(1)
}

export default connectDB
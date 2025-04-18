import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export default mongoose.connect(process.env.DB_URI)

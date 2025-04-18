import mongoose from 'mongoose'

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 100
        },
        code: {
            type: String,
            required: true,
            unique: true,
            maxlength: 20
        },
        location: {
            type: String,
            enum: ['New York', 'San Francisco', 'London'],
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Department', departmentSchema)

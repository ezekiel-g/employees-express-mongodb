const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxlength: 100
        },
        lastName: {
            type: String,
            required: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        },
        hireDate: {
            type: Date,
            required: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        countryCode: {
            type: String,
            required: true,
            match: /^[0-9]{1,4}$/
        },
        phoneNumber: {
            type: String,
            required: true,
            match: /^[0-9]{7,15}$/
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

module.exports = mongoose.model('Employee', employeeSchema)

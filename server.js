require('dotenv').config()
const express = require('express')
const dbConnection = require('./api/v1/database/database')
const departmentRoutes = require('./api/v1/routes/departmentRoutes')
const employeeRoutes = require('./api/v1/routes/employeeRoutes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/v1/departments', departmentRoutes)
app.use('/api/v1/employees', employeeRoutes)

dbConnection
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    })
    .catch(error => {
        console.error('MongoDB connection failure: ', error.message)
        process.exit(1)
    })

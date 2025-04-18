const Employee = require('../models/Employee')
const Department = require('../models/Department')

const validateDepartment = async department => {
    const existingDepartment = await Department.findById(department)
    if (!existingDepartment) { throw new Error('Invalid department') }
}

const handleError = (response, error) => {
    let statusCode = 500
    let message = 'Unexpected error'

    if (error.name === 'ValidationError') {
        statusCode = 400
        message = 'Validation error: ' + error.message
    } else if (error.name === 'CastError') {
        statusCode = 400
        message = 'Invalid ID format'
    } else if (error.name === 'DocumentNotFoundError') {
        statusCode = 404
        message = 'Document not found'
    } else if (error.message === 'Invalid department') {
        statusCode = 400
        message = 'Invalid department'
    }

    console.error('Error: ', error.message)
    return response.status(statusCode).json({ message })
}

const getEmployees = async (request, response) => {
    try {
        const employees = await Employee.find().populate('department')
        response.status(200).json(employees)
    } catch (error) {
        return handleError(response, error)
    }
}

const getEmployee = async (request, response) => {
    const { id } = request.params

    try {
        const employee = await Employee.findById(id).populate('department')
        if (!employee) {
            return response.status(404).json({ message: 'Employee not found' })
        }

        response.status(200).json(employee)
    } catch (error) {
        return handleError(response, error)
    }
}

const addEmployee = async (request, response) => {
    const {
        firstName,
        lastName,
        email,
        hireDate,
        department,
        countryCode,
        phoneNumber,
        isActive
    } = request.body

    try {
        await validateDepartment(department)

        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            hireDate,
            department,
            countryCode,
            phoneNumber,
            isActive,
        })

        const savedEmployee = await newEmployee.save()
        await savedEmployee.populate('department')

        return response.status(201).json({
            message: 'Employee added successfully',
            employee: savedEmployee
        })  
    } catch (error) {
        return handleError(response, error)
    }
}

const editEmployee = async (request, response) => {
    const { id } = request.params
    const {
        firstName,
        lastName,
        email,
        hireDate,
        department,
        countryCode,
        phoneNumber,
        isActive
    } = request.body

    try {
        await validateDepartment(department)

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
                email,
                hireDate,
                department,
                countryCode,
                phoneNumber,
                isActive     
            },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        )

        if (!updatedEmployee) {
            return response.status(404).json({ message: 'Employee not found' })
        }

        return response.status(200).json({
            message: 'Employee updated successfully',
            employee: updatedEmployee
        })
    } catch (error) {
        return handleError(response, error)
    }
}

const deleteEmployee = async (request, response) => {
    const { id } = request.params

    try {
        const employee = await Employee.findByIdAndDelete(id)
        if (!employee) {
            return response.status(404).json({ message: 'Employee not found' })
        }

        response.status(200).json({ message: 'Employee deleted successfully' })
    } catch (error) {
        return handleError(response, error)
    }
}

module.exports = {
    getEmployees,
    getEmployee,
    addEmployee,
    editEmployee,
    deleteEmployee
}

const Department = require('../models/Department')

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
    }

    console.error('Error: ', error.message)
    return response.status(statusCode).json({ message })
}

const getDepartments = async (request, response) => {
    try {
        const departments = await Department.find()
        response.status(200).json(departments)
    } catch (error) {
        return handleError(response, error)
    }
}

const getDepartment = async (request, response) => {
    const { id } = request.params

    try {
        const department = await Department.findById(id)
        if (!department) {
            return response.status(404).json({ message: 'Department not found' })
        }

        response.status(200).json(department)
    } catch (error) {
        return handleError(response, error)
    }
}

const addDepartment = async (request, response) => {
    const { name, code, location, isActive } = request.body

    try {
        const newDepartment = new Department({
            name,
            code,
            location,
            isActive
        })

        const savedDepartment = await newDepartment.save()

        return response.status(201).json({
            message: 'Department added successfully',
            department: savedDepartment
        })
    } catch (error) {
        return handleError(response, error)
    }
}

const editDepartment = async (request, response) => {
    const { id } = request.params
    const { name, code, location, isActive } = request.body

    try {
        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            {
                name,
                code,
                location,
                isActive
            },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        )

        if (!updatedDepartment) {
            return response.status(404).json({ message: 'Department not found' })
        }

        return response.status(200).json({
            message: 'Department updated successfully',
            department: updatedDepartment
        })
    } catch (error) {
        return handleError(response, error)
    }
}

const deleteDepartment = async (request, response) => {
    const { id } = request.params

    try {
        const department = await Department.findByIdAndDelete(id)
        if (!department) {
            return response.status(404).json({ message: 'Department not found' })
        }

        response.status(200).json({ message: 'Department deleted successfully' })
    } catch (error) {
        return handleError(response, error)
    }
}

module.exports = {
    getDepartments,
    getDepartment,
    addDepartment,
    editDepartment,
    deleteDepartment
}

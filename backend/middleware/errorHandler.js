const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    console.error(err.stack)

    // If no status code was set earlier in the request lifecycle,
    // default to 500 (Internal Server Error)
    let statusCode = err.status || (
        res.statusCode && res.statusCode !== 200
            ? res.statusCode
            : 500
    )

    let message = err.message || 'Internal Server Error'

    /**
     * -------------------------------
     * MONGOOSE / DATABASE ERRORS
     * -------------------------------
     */

    // Invalid Mongo ObjectId
    if (err.name === 'CastError') {
        statusCode = 400
        message = 'Invalid resource ID format'
    }

    // Duplicate key (e.g., unique username/email)
    if (err.code === 11000) {
        statusCode = 409
        message = 'Duplicate field value entered'
    }

    // Schema validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = Object.values(err.errors)
            .map(val => val.message)
            .join(', ')
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        message = 'Invalid token'
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401
        message = 'Token expired'
    }

    if (err.message === 'Unauthorized') {
        statusCode = 401
        message = 'Authentication required'
    }

    if (err.message === 'Forbidden') {
        statusCode = 403
        message = 'You do not have permission to perform this action'
    }

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}

module.exports = errorHandler
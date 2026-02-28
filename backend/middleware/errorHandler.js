const errorHandler = (err, req, res, next) => {
    console.error(err.stack)

    // If no status code was set earlier in the request lifecycle,
    // default to 500 (Internal Server Error)
    let statusCode = res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500

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

    /**
     * -------------------------------
     * AUTH & SECURITY (PLANNED)
     * -------------------------------
     *
     * These status codes will be introduced once JWT authentication
     * and role-based authorization middleware are implemented.
     *
     * 401 → Unauthorized
     *      - Missing or invalid access token
     *
     * 403 → Forbidden
     *      - Authenticated but insufficient permissions
     *
     * 429 → Too Many Requests
     *      - To be used with rate-limiting middleware
     */

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}

module.exports = errorHandler
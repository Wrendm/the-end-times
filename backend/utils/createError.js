class AppError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
    this.isOperational = true
  }
}

const createError = (message, status) => {
  return new AppError(message, status)
}

module.exports = createError
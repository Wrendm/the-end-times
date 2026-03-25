const sendResponse = (res, { status = 200, message, data }) => {
    return res.status(status).json({ message, data })
}

module.exports = sendResponse

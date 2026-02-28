const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.get(['/', '/index', '/index.html'], (req, res) => {
    res.send('API is running...');
});

app.use('/users', require('./routes/user.routes.js'))
app.use('/posts', require('./routes/post.routes.js'))

app.use((req, res, next) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found`})
    next(app.use(errorHandler))
})

module.exports = app
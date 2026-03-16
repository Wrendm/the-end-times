const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./middleware/cors')
const cookieParser = require('cookie-parser')

const app = express()

app.use(corsOptions)
app.use(express.json())
app.use(cookieParser())

app.get(['/', '/index', '/index.html'], (req, res) => {
    res.send('API is running...');
});

app.use('/users', require('./routes/user.routes.js'))
app.use('/posts', require('./routes/post.routes.js'))
app.use('/auth', require('./routes/auth.routes.js'))

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

app.use(errorHandler)

module.exports = app
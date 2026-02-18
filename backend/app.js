const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get(['/', '/index', '/index.html'], (req, res) => {
    res.send('API is running...');
});

app.use('/users', require('./routes/userRoutes.js'))


app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found`});
});

module.exports = app;
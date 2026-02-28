const cors = require('cors')

const allowedOrigins = [
  'http://localhost:3000',          // dev
  'https://graceful-longma-d2fa65.netlify.app/' // production
]

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}

module.exports = cors(corsOptions)
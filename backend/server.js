const mongoose = require('mongoose')
const app = require('./app')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const PORT = process.env.PORT || 3500

const MONGO_URI =
    process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI_PROD
        : process.env.NODE_ENV === 'test'
            ? process.env.MONGO_URI_TEST
            : process.env.MONGO_URI_DEV;

if (!MONGO_URI) {
    throw new Error(`Mongo URI missing for NODE_ENV=${process.env.NODE_ENV}`);
}

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI_PROD exists:", !!process.env.MONGO_URI_PROD);
console.log("MONGO_URI_DEV exists:", !!process.env.MONGO_URI_DEV);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to MongoDB (${process.env.NODE_ENV === 'test' ? 'test' : 'dev'} database)`)
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err)
    })
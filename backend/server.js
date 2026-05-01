require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3500;

/**
 * Prefer explicit env vars, but avoid relying on NODE_ENV branching.
 * This prevents deployment issues across Render / local / test.
 */
const env = process.env.NODE_ENV;

let MONGO_URI;

if (env === "production") {
  MONGO_URI = process.env.MONGO_URI_PROD;
} else if (env === "test") {
  MONGO_URI = process.env.MONGO_URI_TEST;
} else {
  MONGO_URI = process.env.MONGO_URI_DEV;
}

// Safety check
if (!MONGO_URI) {
    throw new Error(
        `Mongo URI is missing. NODE_ENV=${process.env.NODE_ENV}`
    );
}

// Debug logs (safe for server startup troubleshooting)
console.log('NODE_ENV:', process.env.NODE_ENV);

/**
 * Connect to MongoDB
 */
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Database name:', mongoose.connection.db.databaseName);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
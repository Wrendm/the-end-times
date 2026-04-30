const mongoose = require('mongoose');
const app = require('./app');

// Load env only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3500;

/**
 * Prefer explicit env vars, but avoid relying on NODE_ENV branching.
 * This prevents deployment issues across Render / local / test.
 */
const MONGO_URI =
  process.env.MONGO_URI_PROD ||
  process.env.MONGO_URI_TEST ||
  process.env.MONGO_URI_DEV;

// Safety check
if (!MONGO_URI) {
  throw new Error(
    `Mongo URI is missing. NODE_ENV=${process.env.NODE_ENV}`
  );
}

// Debug logs (safe for server startup troubleshooting)
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI_PROD exists:', !!process.env.MONGO_URI_PROD);
console.log('MONGO_URI_TEST exists:', !!process.env.MONGO_URI_TEST);
console.log('MONGO_URI_DEV exists:', !!process.env.MONGO_URI_DEV);
console.log('Mongo URI selected:', 'set');

/**
 * Connect to MongoDB
 */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
const rateLimit = require('express-rate-limit')

const isTest = process.env.NODE_ENV === 'test'

const createLimiter = (max, message) => rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? 5 : max,

  keyGenerator: () => 'test-ip', // ✅ critical for Jest

  standardHeaders: true,
  legacyHeaders: false,

  message: { message }
})

// Posts
const getLimiter = createLimiter(100, 'Too many requests')
const postLimiter = createLimiter(10, 'Too many posts created')
const updateLimiter = createLimiter(20, 'Too many updates')
const deleteLimiter = createLimiter(5, 'Too many deletes')

// Auth
const signupLimiter = createLimiter(5, 'Too many account creation attempts')
const loginLimiter = createLimiter(10, 'Too many login attempts')
const refreshLimiter = createLimiter(15, 'Too many refresh attempts')
const logoutLimiter = createLimiter(10, 'Too many logout attempts')

module.exports = {
  getLimiter,
  postLimiter,
  updateLimiter,
  deleteLimiter,
  signupLimiter,
  loginLimiter,
  refreshLimiter,
  logoutLimiter
}
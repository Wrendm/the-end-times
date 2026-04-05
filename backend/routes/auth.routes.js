const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const validate = require('../validators/validate')
const { createUserSchema } = require('../validators/user.validator')
const { loginSchema } = require('../validators/login.validator')
const verifyJWT = require('../middleware/verifyJWT')
const { getLimiter, signupLimiter, loginLimiter, refreshLimiter, logoutLimiter } = require('../middleware/rateLimit')


router.get('/me', getLimiter, verifyJWT, authController.getCurrentUser)
router.get('/refresh', refreshLimiter, authController.refreshUser)

router.post('/register', signupLimiter, validate(createUserSchema), authController.registerUser)
router.post('/login', loginLimiter, validate(loginSchema), authController.loginUser)
router.post('/logout', logoutLimiter, authController.logoutUser)


module.exports = router
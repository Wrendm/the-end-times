const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const validate = require('../validators/validate')
const { createUserSchema } = require('../validators/user.validator')
const { loginSchema } = require('../validators/login.validator')

router.get('/me', authController.getCurrentUser)
router.get('/refresh', authController.refreshUser)

router.post('/register', validate(createUserSchema), authController.registerUser)
router.post('/login', validate(loginSchema), authController.loginUser)
router.post('/logout', authController.logoutUser)


module.exports = router
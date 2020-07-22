const express = require('express')
// const bodyParser = require('body-parser')

const { unsupportedController, loginController, registerEmail, registerCredentials, resendOtp, verifyOtp } = require('../controllers/auth.controller')

const authRouter = express.Router()
// authRouter.use(bodyParser.json())

authRouter.post('/login', loginController)

authRouter.post('/register', registerCredentials)

authRouter.post('/email-register', registerEmail)

authRouter.get('/resend', resendOtp)

authRouter.post('/otp-verification', verifyOtp)

module.exports = authRouter

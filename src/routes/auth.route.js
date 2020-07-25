const express = require('express')
// const bodyParser = require('body-parser')

const { authentication, loginController, registerEmail, registerCredentials, resendOtp, verifyOtp } = require('../controllers/auth.controller')

const authRouter = express.Router()
// authRouter.use(bodyParser.json())

authRouter.post('/login', loginController)

authRouter.post('/register', authentication, registerCredentials)

authRouter.post('/email-register', registerEmail)

authRouter.get('/resend', authentication, resendOtp)

authRouter.post('/otp-verification', authentication, verifyOtp)

module.exports = authRouter

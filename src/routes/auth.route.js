const express = require('express')
// const bodyParser = require('body-parser')

const { authentication, loginController, registerEmail, registerCredentials, resendOtp, verifyOtp, countriesList, logout, getUser } = require('../controllers/auth.controller')

const authRouter = express.Router()
// authRouter.use(bodyParser.json())

authRouter.post('/login', loginController)

authRouter.post('/email-register', registerEmail)

authRouter.post('/register', authentication, registerCredentials)

authRouter.get('/resend', authentication, resendOtp)

authRouter.post('/otp-verification', authentication, verifyOtp)

authRouter.get('/logout', authentication, logout)

authRouter.get('/countries-list/:search', countriesList)

authRouter.get('/user', authentication, getUser)

module.exports = authRouter

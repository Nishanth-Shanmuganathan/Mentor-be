const express = require('express')

const { getConnections } = require('./../controllers/conn.controller')

const connRouter = express.Router()

connRouter.get('', getConnections)

// connRouter.post('/register', authentication, registerCredentials)

// connRouter.post('/email-register', registerEmail)

// connRouter.get('/resend', authentication, resendOtp)

// connRouter.post('/otp-verification', authentication, verifyOtp)

// connRouter.get('/countries-list/:search', countriesList)


module.exports = connRouter

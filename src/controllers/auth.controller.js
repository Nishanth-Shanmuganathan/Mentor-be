const Cryptr = require('cryptr')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const request = require('request')

const User = require('../models/user.model')
const { registrationLink, otpMail } = require('../mails/mail')

const cryptr = new Cryptr('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')


exports.loginController = async (req, res) => {
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  try {
    const user = await User.findOne({ email })
    const match = await bcrypt.compare(password, user.password)
    if (!match) { throw new Error('Authentication failed') }
    if (req.header('Authorization')) {
      const token = req.header('Authorization').replace('Bearer ', '')
      if (user.tokens === token) {
        return res.status(200).send({ token, user })
      }
    }
    const token = jwt.sign({ id: user._id }, process.env.ENCODE_STRING)
    user.tokens = token
    await user.save()
    res.status(200).send({ token, user })
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Authentication failed' })
  }
}

exports.registerEmail = async (req, res) => {
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  const confirmPassword = req.body.confirmPassword.trim()
  if (password !== confirmPassword) {
    return res.status(400).send({ message: 'Password mismatch' })
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 8)
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    const user = new User({
      email,
      password: hashedPassword,
      otp
    })
    const token = jwt.sign({ id: user._id }, process.env.ENCODE_STRING)

    user.tokens = token
    await user.save()
    await otpMail(req.body.email, otp)
    res.status(200).send({ token })
  } catch (error) {
    if (error.message.includes('User validation failed')) {
      res.status(400).send({ message: 'Email-Id already exists' })
      console.log(error.message);

    }
  }
}


exports.registerCredentials = async (req, res) => {
  const user = req.user
  const details = req.body
  user.username = details.username.trim()
  user.mobile = details.mobile.trim()
  user.country = details.country.trim()
  user.city = details.city.trim()
  user.role = details.role.trim()
  for (const key in details.professional) {
    if (details.professional.hasOwnProperty(key)) {
      if (typeof details.professional[key] == 'string') {
        details.professional[key] = details.professional[key].trim()
      }
    }
  }
  user.roleDetails = details.professional
  try {
    await user.save()
    res.status(200).send({ message: 'Registration successful', user })
  } catch (error) {
    res.status(400).send({ message: 'Registration unsuccessful' })
  }

}

exports.resendOtp = async (req, res) => {
  const user = req.user
  try {
    if (user.tokens === token) {
      await otpMail(user.email, user.otp)
      res.status(200).send({ mesage: 'OTP sent successfully' })
    } else {
      res.status(400).send({ message: 'Authentication denied' })
    }
  } catch (error) {
    res.status(400).send(error.message)
  }

}

exports.verifyOtp = async (req, res) => {
  const otp = req.body.otp
  const user = req.user
  try {
    if (user.otp === otp) {
      user.otp = undefined
      user.emailVerified = true
      await user.save()
      res.status(200).send({ mesage: 'OTP sent successfully' })
    } else {
      res.status(400).send({ message: 'Authentication denied' })
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
}

exports.authentication = async (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '')
  const otp = req.body.otp
  const { id } = jwt.decode(token)
  try {
    const user = await User.findOne({ _id: id })
    if (!user || user.tokens !== token) throw new Error('Authentication failed')
    req.user = user
    next()
  } catch (error) {
    // console.log(error)
    res.status(400).send({ message: 'Authentication failed' })
  }
}

exports.countriesList = (req, res) => {
  const search = req.params.search
  const formattingCountryList = body => {
    const countries = []
    body.forEach(ele => {
      const country = {}
      country['name'] = ele['name']
      country['code'] = ele['callingCodes'][0]
      countries.push(country)
    })
    return countries
  }
  // console.log('https://api.mapbox.com/geocoding/v5/mapbox.places/' + search + '.json');
  request({ url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + search + '.json?access_token=pk.eyJ1IjoibmlzaGFudGgwNSIsImEiOiJja2FmbGFocWwyNzNiMnZzOTEwNXJ2YXhwIn0._YYw0z0qyiSba5q1TCu7Mg', json: true }, (err, data) => {
    if (!err) {
      res.status(200).send({ data: data.body.features })
    }
  })
}


exports.logout = async (req, res) => {
  const id = req.user._id
  try {
    const user = await User.findById(id)
    user.tokens = ''
    await user.save()
    res.status(200).send({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(400).send({ message: 'Cannot logout' })
  }
}


exports.getUser = (req, res) => {
  if (req.user) {
    res.status(200).send({ user: req.user })
  } else {
    res.status(400).send({ message: 'Authentication denied' })
  }
}

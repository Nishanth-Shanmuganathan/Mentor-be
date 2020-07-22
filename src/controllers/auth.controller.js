const Cryptr = require('cryptr')
// const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')

const User = require('../models/user.model')
const { registrationLink, otpMail } = require('../mails/mail')

const cryptr = new Cryptr('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')

exports.unsupportedController = (req, res) => {
  res.status(403).send({ message: 'Method forbidden' })
}

exports.loginController = async (req, res) => {
  const _id = req.body._id
  const email = req.body.email
  const password = req.body.password
  try {
    const user = await User.findById(_id)
    const match = await bcrypt.compare(password, user.password)
    if (!match) { throw new Error() }
    const token = req.header('Authorization').replace('Bearer ', '')
    const decodedId = jwt.decode(token, 'Averylongstring thaat has secret')
    res.status(200).send(decodedId)
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Login unsuccessful' })

  }
}

exports.registerEmail = async (req, res) => {
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const role = req.body.role
  if (password !== confirmPassword) {
    res.status(400).send({ message: 'Password mismatch' })
  }
  try {

    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    const user = new User({
      email,
      password,
      otp
    })
    const token = jwt.sign({ id: user._id }, process.env.ENCODE_STRING)

    user.tokens.push(token)
    console.log(user);
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
  const email = cryptr.decrypt(req.params.email);
  let password = req.body.password
  const username = req.body.username
  try {
    if (password !== req.body.confirm) { throw new Error() }
    password = await bcrypt.hash(password, 8)
    const user = new User({ email, username, password })
    const result = await user.save()
    const token = await jwt.sign({ _id: result._id }, 'Averylongstring thaat has secret')
    user.tokens.push(token)
    await user.save()
    res.send({ message: 'Registration successful', data: result })
  } catch (error) {
    console.log(error);
    let errorMessage = ''
    if (error.errors.email) { errorMessage = 'Email Id already exists' }
    res.status(400).send({ message: 'Registration unsuccessful', error: errorMessage })
  }

}

exports.resendOtp = async (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '')

  const { id } = jwt.decode(token)
  try {
    const user = await User.findOne({ _id: id })
    if (user.tokens.includes(token)) {
      await otpMail(user.email, user.otp)
      res.status(200).send({ mesage: 'OTP sending successful' })
    } else {
      res.status(400).send({ message: 'Authentication denied' })
    }
  } catch (error) {
    res.status(400).send(error.message)
  }

}

exports.verifyOtp = async (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '')
  const otp = req.body.otp
  const { id } = jwt.decode(token)
  try {
    const user = await User.findOne({ _id: id })
    console.log(user.tokens.includes(token), user.otp === otp, user.otp, otp);
    if (user.tokens.includes(token) && user.otp === otp) {
      user.otp = ''
      await user.save()
      res.status(200).send({ mesage: 'OTP sending successful' })
    } else {
      res.status(400).send({ message: 'Authentication denied' })
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
}

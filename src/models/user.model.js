const mongoose = require('mongoose')
const mongooseValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
  },
  otp: {
    type: String,
  },
  tokens: {
    type: [String],
    default: []
  }
})
userSchema.plugin(mongooseValidator)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}
module.exports = mongoose.model('User', userSchema)

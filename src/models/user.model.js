const mongoose = require('mongoose')
const mongooseValidator = require('mongoose-unique-validator')

const StartupDetails = {
  company: {
    type: String
  },
  domain: {
    type: String
  },
  ctc: {
    type: Number
  },
  employees: {
    type: Number
  }
}

const MentorDetails = {
  company: {
    type: String
  },
  position: {
    type: String
  },
  preference: {
    type: String
  },
  ctc: {
    type: Number
  },
  experience: {
    type: Number
  }
}

const Notification = {
  action: {
    type: String,
    required: true
  },
  doerName: {
    type: String,
    required: true
  },
  doerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}
const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  mobile: {
    type: Number
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  emailVerified: {
    type: Boolean,
    default: false
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
  city: {
    type: String
  },
  country: {
    type: String
  },
  roleDetails: {
    type: StartupDetails || MentorDetails
  },
  tokens: {
    type: String,
  },
  connections: {
    type: [String] || [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  pending: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  sent: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  notifications: {
    type: [Notification],
    default: []
  }
})

userSchema.virtual('queries', {
  ref: 'Query',
  localField: '_id',
  foreignField: 'author'
})
userSchema.plugin(mongooseValidator)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.otp
  delete userObject.tokens
  return userObject
}
module.exports = mongoose.model('User', userSchema)

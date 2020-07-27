const mongoose = require('mongoose')

const querySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  comments: {
    type: [{
      imageUrl: String,
      query: String,
      username: String,
      company: String
    }],
    default: []
  }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Query', querySchema)

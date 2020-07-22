const mongoose = require('mongoose')
const CommentSchema = require('./comment.model')

const querySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId
  },
  comments: {
    type: [CommentSchema],
    default: []
  }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Query', querySchema)

const express = require('express')

const { getComments, postComments, putComments, deleteComments } = require('../controllers/comment.controller')

const commentRouter = express.Router()

commentRouter.route('/:id')
  .get(getComments)
  .post(postComments)
  .put(putComments)
  .delete(deleteComments)

module.exports = commentRouter

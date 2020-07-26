const express = require('express')

const { getQuery, postQuery } = require('../controllers/query.controller')
const { getSpecificQuery, deleteSpecificQuery, putSpecificQuery, deleteSpecificComment } = require('../controllers/query-specific.controller')

const queryRouter = express.Router()

queryRouter.route('/')
  .get(getQuery)
  .post(postQuery)

queryRouter.route('/:id')
  .put(putSpecificQuery)
  .delete(deleteSpecificQuery)

queryRouter.route('/:queryId/:commentId')
  .delete(deleteSpecificComment)
module.exports = queryRouter


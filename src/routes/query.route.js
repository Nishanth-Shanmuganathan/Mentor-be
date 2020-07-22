const express = require('express')

const { getQuery, postQuery, deleteQuery, putQuery } = require('../controllers/query.controller')
const { getSpecificQuery, postSpecificQuery, deleteSpecificQuery, putSpecificQuery } = require('../controllers/query-specific.controller')

const queryRouter = express.Router()

queryRouter.route('/')
  .get(getQuery)
  .post(postQuery)
  .put(putQuery)
  .delete(deleteQuery)

queryRouter.route('/:queryId')
  .get(getSpecificQuery)
  .post(postSpecificQuery)
  .put(putSpecificQuery)
  .delete(deleteSpecificQuery)

module.exports = queryRouter


const express = require('express')

const { getConnections, sendRequest } = require('./../controllers/conn.controller')

const connRouter = express.Router()

connRouter.get('', getConnections)

connRouter.post('/:id', sendRequest)


module.exports = connRouter

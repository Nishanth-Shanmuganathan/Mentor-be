const express = require('express')

const { getConnections, sendRequest, accept, reject, withdraw } = require('./../controllers/conn.controller')

const connRouter = express.Router()

connRouter.get('', getConnections)

connRouter.post('/:id', sendRequest)

connRouter.get('/withdraw/:id', withdraw)

connRouter.get('/accept/:id', accept)

connRouter.get('/reject/:id', reject)


module.exports = connRouter

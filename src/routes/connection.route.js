const express = require('express')

const { getConnections, getMyConnections, sendRequest, accept, reject, withdraw, remove } = require('./../controllers/conn.controller')

const connRouter = express.Router()

connRouter.get('', getConnections)

connRouter.get('/my', getMyConnections)

connRouter.post('/:id', sendRequest)

connRouter.get('/withdraw/:id', withdraw)

connRouter.get('/accept/:id', accept)

connRouter.get('/reject/:id', reject)

connRouter.get('/remove/:id', remove)


module.exports = connRouter

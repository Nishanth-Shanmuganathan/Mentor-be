const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const authRouter = require('./src/routes/auth.route')
const queryRouter = require('./src/routes/query.route')
const connRouter = require('./src/routes/connection.route')

const { authentication } = require('./src/controllers/auth.controller')

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.use('/public', express.static('public'))
app.use('/auth', authRouter)
app.use('/queries', authentication, queryRouter)
app.use('/conn', authentication, connRouter)

const port = process.env.PORT || 3000
mongoose.connect('mongodb://127.0.0.1/mentor-hub', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(async res => {
  await app.listen(port)
  console.log('Connected on port : ' + port);
})
  .catch(err => {
    console.log(err);
  })

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const queryRouter = require('./src/routes/query.route')
const commentRouter = require('./src/routes/comment.route')
const authRouter = require('./src/routes/auth.route')

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


app.use('/auth', authRouter)
app.use('/queries', queryRouter)
app.use('/comments', commentRouter)

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
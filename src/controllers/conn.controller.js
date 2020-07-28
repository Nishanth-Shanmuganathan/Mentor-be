const mongoose = require('mongoose')

const User = require('./../models/user.model')

exports.getConnections = async (req, res) => {
  const currentUser = req.user
  if (currentUser.role === 'Start-up') {
    const user = await User.find({ role: 'Mentor' })
    res.status(200).send({ data: user })
  } else {
    const user = await User.find({ role: 'Start-up' })
    res.status(200).send({ data: user })
  }
}

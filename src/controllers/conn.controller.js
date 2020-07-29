const mongoose = require('mongoose')

const User = require('./../models/user.model')
const { send } = require('process')

exports.getConnections = async (req, res) => {
  const currentUser = req.user
  let users;
  try {
    if (currentUser.role === 'Start-up') {
      users = await User.find({ role: 'Mentor' })
    } else {
      users = await User.find({ role: 'Start-up' })
    }
    users = users.filter(user => {
      if (user.pending.includes(currentUser._id) || user.connections.includes(currentUser._id)) return false
      return true
    })

    res.status(200).send({ data: users })
  } catch (error) {
    res.status(404).send({ message: 'Unable to fetch users' })
  }
}

exports.sendRequest = async (req, res) => {
  const receiverId = req.params.id
  const senderId = req.user._id
  try {
    const receiver = await User.findById(receiverId)
    const sender = req.user
    receiver.pending.push(sender)
    receiver.notifications.push({ action: 'received', doerId: senderId, doerName: sender.username })
    sender.sent.push(receiver)
    sender.notifications.push({ action: 'sent', doerId: receiverId, doerName: receiver.username })
    await receiver.save()
    await sender.save()
    res.status(200).send({ message: 'Request sent successfully', user: sender })
  } catch (error) {
    res.status(400).send({ message: 'Unable to send request' })
  }

}

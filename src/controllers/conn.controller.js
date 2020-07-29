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
      if (user.pending.includes(currentUser._id) ||
        user.connections.includes(currentUser._id) ||
        user.sent.includes(currentUser._id)
      ) return false
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
    receiver.pending.unshift(sender)
    receiver.notifications.unshift({ action: 'received', doerId: senderId, doerName: sender.username })
    sender.sent.unshift(receiver)
    sender.notifications.unshift({ action: 'sent', doerId: receiverId, doerName: receiver.username })
    await receiver.save()
    await sender.save()
    res.status(200).send({ message: 'Request sent successfully', user: sender })
  } catch (error) {
    res.status(400).send({ message: 'Unable to send request' })
  }
}

exports.withdraw = async (req, res) => {
  const sender = req.user
  const receiverId = req.params.id
  try {
    const receiver = await User.findById(receiverId)

    const index = sender.sent.findIndex(ele => ele.toString() === receiver._id.toString())
    sender.sent.splice(index, 1)

    const index2 = receiver.pending.findIndex(ele => ele.toString() === sender._id.toString())
    receiver.pending.splice(index2, 1)

    const index3 = sender.notifications.findIndex(ele => ele.doerId.toString() === receiver._id.toString() && ele.action === 'sent')
    sender.notifications.splice(index3, 1)

    const index4 = receiver.notifications.findIndex(ele => ele.doerId.toString() === sender._id.toString() && ele.action === 'received')
    receiver.notifications.splice(index4, 1)

    await sender.save()
    await receiver.save()

    res.status(200).send({ message: 'Connection request withdrawn', user: sender })
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Cannot withdraw request' })
  }
}

exports.reject = async (req, res) => {
  const receiver = req.user
  const senderId = req.params.id
  try {
    const sender = await User.findById(senderId)
    const index = sender.sent.findIndex(ele => ele.toString() === receiver._id.toString())
    sender.sent.splice(index, 1)


    const index2 = receiver.pending.findIndex(ele => ele.toString() === senderId.toString())
    receiver.pending.splice(index2, 1)

    const index3 = sender.notifications.findIndex(ele => ele.doerId.toString() === receiver._id.toString() && ele.action === 'sent')
    sender.notifications.splice(index3, 1)

    const index4 = receiver.notifications.findIndex(ele => ele.doerId.toString() === sender._id.toString() && ele.action === 'received')
    receiver.notifications.splice(index4, 1)

    await sender.save()
    await receiver.save()

    res.status(200).send({ message: 'Connection request rejected', user: receiver })
  } catch (error) {
    res.status(400).send({ message: 'Cannot reject request' })
  }
}

exports.accept = async (req, res) => {
  const receiver = req.user
  const senderId = req.params.id
  try {
    const sender = await User.findById(senderId)
    const index = sender.sent.findIndex(ele => ele.toString() === receiver._id.toString())
    sender.sent.splice(index, 1)
    if (sender.connections.findIndex(ele => ele.toString() === receiver._id.toString()) < 0) {
      return res.status(400).send({ message: 'User is already in connection' })
    }
    sender.connections.unshift(receiver._id)


    const index2 = receiver.pending.findIndex(ele => ele.toString() === senderId.toString())
    receiver.pending.splice(index2, 1)
    if (receiver.connections.findIndex(ele => ele.toString() === sender._id.toString()) < 0) {
      return res.status(400).send({ message: 'User is already in connection' })
    }
    receiver.connections.unshift(sender._id)

    const index3 = sender.notifications.findIndex(ele => ele.doerId.toString() === receiver._id.toString() && ele.action === 'sent')
    let notification = sender.notifications[index3]
    notification['action'] = 'accepted'
    sender.notifications.unshift(notification)
    sender.notifications.splice(index3, 1)

    const index4 = receiver.notifications.findIndex(ele => ele.doerId.toString() === sender._id.toString() && ele.action === 'received')
    let notification2 = receiver.notifications[index4]
    notification2['action'] = 'connected'
    receiver.notifications.unshift(notification2)
    receiver.notifications.splice(index4, 1)

    await sender.save()
    await receiver.save()

    res.status(200).send({ message: 'Connection request accepted', user: receiver })
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Cannot accept request' })
  }
}

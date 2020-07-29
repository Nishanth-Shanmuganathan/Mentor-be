const mongoose = require('mongoose')

const User = require('../models/user.model')
const Query = require('../models/query.model')

//Getting all the available queries of a user
exports.getQuery = async (req, res) => {
  try {
    const queries = await Query.find({ author: req.user._id }).populate('author')
    if (queries.length === 0) { throw new Error() }
    res.status(200).send({ queries })
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: 'No queries not found' })
  }
}

//Adding a query
exports.postQuery = async (req, res) => {
  const id = req.user._id
  const queryData = { ...req.body, author: id }
  try {
    const user = await User.findById(id)
    if (user.role !== 'Start-up') { throw new Error() }
    let query = new Query(queryData)
    const result = await query.save()
    if (user.connections.length) {
      user.connections.forEach(async (connectionId) => {
        const connection = await User.findById(connectionId)
        connection.notifications.push({ action: 'query', doerId: id, doerName: user.username })
        await connection.save()
      });
      console.log('Addition updated to connections');
    }

    await result.populate('author').execPopulate()
    res.status(201).send({ message: 'Query added successfully', query: result })
  } catch (error) {
    res.status(400).send({ message: 'Unable to add query' })
  }
}


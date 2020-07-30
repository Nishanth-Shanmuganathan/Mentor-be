const mongoose = require('mongoose')

const User = require('../models/user.model')
const Query = require('../models/query.model')

//Getting all the available queries of a user
exports.getQuery = async (req, res) => {
  const user = req.user
  try {
    let queries = [];
    if (user.role === 'Start-up') {
      queries = await Query.find({ author: user._id }).populate('author')
    } else {
      for (let i = 0; i < user.connections.length; i++) {
        const userQueries = await Query.find({ author: user.connections[i] }).populate('author')
        queries = [...queries, ...userQueries]
      }
    }
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
        await connection.save()
      });
      console.log('Addition updated to connections');
    }

    await result.populate('author').execPopulate()
    res.status(201).send({ message: 'Query added successfully', query: result, user })
  } catch (error) {
    res.status(400).send({ message: 'Unable to add query' })
  }
}


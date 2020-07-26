const mongoose = require('mongoose')

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
  const queryData = { ...req.body, author: req.user._id }
  try {
    let query = new Query(queryData)
    const result = await query.save()
    await result.populate('author').execPopulate()
    res.status(201).send({ message: 'Query added successfully', query: result })
  } catch (error) {
    res.status(400).send({ message: 'Unable to add query' })
  }
}

//Cannot update all queries
exports.putQuery = (req, res) => {
  res.status(403).send({ message: "Put method is not allowed" })
}

//Deleting all the queries available
exports.deleteQuery = async (req, res) => {
  try {
    const result = await Query.deleteMany({})
    if (result.deletedCount === 0) { throw new Error() }
    res.status(200).send({ message: 'Deleted ' + result.deletedCount + ' query(s)' })
  } catch (error) {
    res.status(400).send({ message: 'Unable to delete queries' })
  }
}

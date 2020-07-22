const mongoose = require('mongoose')

const Query = require('../models/query.model')

//Getting the specific query of a user
exports.getSpecificQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.queryId)
    res.status(200).send(query)
  } catch (error) {
    res.status(404).send({ message: 'Query not found' })
  }
}

//Cannot add a specific query
exports.postSpecificQuery = (req, res) => {
  res.status(403).send({ message: "Post method is not allowed" })
}

//Updating the query
exports.putSpecificQuery = async (req, res) => {
  const allowedUpdate = ['description', 'domain']
  const requestedUpdate = Object.keys(req.body)
  const valid = requestedUpdate.every(update => allowedUpdate.includes(update))
  try {
    if (!valid) { throw new Error() }
    const result = await Query.findByIdAndUpdate(req.params.queryId, req.body, { new: true })
    res.status(201).send(result)
  } catch (error) {
    res.status(400).send({ message: "Unable to update query" })
  }
}

//Deleting the particular query
exports.deleteSpecificQuery = async (req, res) => {
  try {
    const result = await Query.deleteOne({ _id: req.params.queryId })
    if (result.deletedCount === 0) { throw new Error() }
    res.status(200).send({ message: 'Query deleted' })
  } catch (error) {
    res.status(400).send({ message: "Unable to delete query" })
  }
}

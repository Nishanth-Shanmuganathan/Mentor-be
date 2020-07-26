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


//Updating the query
exports.putSpecificQuery = async (req, res) => {
  const queryId = req.params.queryId
  const answer = {
    imageUrl: req.user.imageUrl,
    query: req.body.answer.trim(),
    username: req.user.username,
    company: req.user.roleDetails.company
  }
  console.log(answer);
  try {
    const query = await Query.findById(queryId).populate('author')
    query.comments.push(answer)
    // console.log(query);
    await query.save()
    res.status(201).send({ query })
  } catch (error) {
    console.log(error);
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

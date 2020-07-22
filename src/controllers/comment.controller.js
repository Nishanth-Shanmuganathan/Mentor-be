const mongoose = require('mongoose')

const Query = require('../models/query.model')

exports.getComments = (req, res) => {
  res.status(400).send('Cannot access  the comments separately')
}

exports.postComments = async (req, res) => {
  const id = req.body.id
  const data = req.body.data
  try {
    const query = await Query.findById(req.params.id)
    if (!query) { throw new Error() }
    if (!id) { query.comments.push(data) }
    else {
      let flag = 0
      query.comments.forEach(ele => {
        if (ele._id == id) {
          ele.reply.push({ ...data, _id: mongoose.Types.ObjectId(), createdAt: new Date(), updatedAt: new Date() })
          flag++
        }
      })
      if (flag === 0) { throw new Error() }
    }
    await query.save()
    res.status(201).send({ message: 'Updated successfully', query })
  } catch (error) {
    res.status(400).send({ message: 'Unable to add comment' })
  }
}

exports.putComments = async (req, res) => {
  const comment = req.body.comment
  const id = req.body.id
  try {
    const query = await Query.findById(req.params.id)
    if (!query) { throw new Error() }
    let flag = 0
    query.comments.forEach((ele) => {
      if (ele._id == id && flag === 0) {
        ele.comment = comment
        flag++
      }
    })
    if (!flag) { throw new Error() }
    const result = await query.save()
    console.log(result.comments[0].reply);
    res.status(200).send({ message: 'Updated successfully', query })

  } catch (error) {
    res.status(400).send({ message: 'Unable to update comment' })
  }
}

exports.deleteComments = async (req, res) => {
  const id = req.body.id
  try {
    const query = await Query.findById(req.params.id)
    if (!query) { throw new Error() }
    let flag = 0
    query.comments.forEach((ele, index, array) => {
      if (ele._id == id && flag === 0) {
        array.splice(index, 1)
        flag++
      } else {
        ele.reply.forEach((ele, index, array) => {
          if (ele._id == id && flag === 0) {
            array.splice(index, 1)
            flag++
          }
        })
      }
    })
    if (!flag) { throw new Error() }
    await query.save()
    res.status(200).send({ message: 'Deletion successful', query })

  } catch (error) {
    res.status(400).send({ message: 'Unable to delete comment' })
  }
}

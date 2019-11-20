/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const CommentsModel = require('./comments.model')

exports.findAllCommentsObject = (queryObject) => {
  return CommentsModel.find(queryObject)
    .populate('postId')
    .exec()
}

exports.findCommentObjectUsingAggregate = (aggregateObject) => {
  return CommentsModel.aggregate(aggregateObject)
    .exec()
}

exports.createCommentObject = (payload) => {
  let obj = new CommentsModel(payload)
  return obj.save()
}

exports.genericUpdateCommentObject = (query, updated, options) => {
  return CommentsModel.update(query, updated, options)
    .exec()
}

exports.deleteCommentObjectUsingQuery = (query) => {
  return CommentsModel.deleteMany(query)
    .exec()
}

/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const CommentCaptureModel = require('./comment_capture.model')

exports.findOnePostObject = (postId) => {
  return CommentCaptureModel.findOne({_id: postId})
    .exec()
}

exports.findOnePostObjectUsingQuery = (queryObject) => {
  return CommentCaptureModel.findOne(queryObject)
    .exec()
}

exports.findAllPostObjectsUsingQuery = (queryObject) => {
  return CommentCaptureModel.find(queryObject)
    .exec()
}

exports.findPostObjectUsingAggregate = (aggregateObject) => {
  return CommentCaptureModel.aggregate(aggregateObject)
    .then()
}

exports.createPostObject = (payload) => {
  let obj = new CommentCaptureModel(payload)
  return obj.save()
}

exports.updatePostObject = (postId, payload) => {
  return CommentCaptureModel.updateOne({_id: postId}, payload)
    .exec()
}

exports.deletePostObject = (postId) => {
  return CommentCaptureModel.deleteOne({_id: postId})
    .exec()
}

/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const CommentCaptureModel = require('./comment_capture.model')

exports.findOnePostObjectUsingQuery = (queryObject) => {
  return CommentCaptureModel.findOne(queryObject)
    .populate('pageId userId companyId')
    .exec()
}

exports.findAllPostObjectsUsingQuery = (queryObject) => {
  return CommentCaptureModel.find(queryObject)
    .populate('pageId userId companyId')
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

exports.genericUpdatePostObject = (query, updated, options) => {
  return CommentCaptureModel.update(query, updated, options)
    .exec()
}

exports.deletePostObject = (postId) => {
  return CommentCaptureModel.deleteMany({_id: postId})
    .exec()
}

exports.deleteOneUsingQuery = (postId) => {
  return CommentCaptureModel.deleteOne({post_id: postId})
    .exec()
}
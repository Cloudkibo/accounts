/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

/*
Review Comments
--> findOnePostObject can be done from findOnePostObjectUsingQuery
--> updatePostObject can be done from genericUpdatePostObject
--> instead of deleteOne we should use deleteMany. So that, it can be used for deleteMany as well
*/

const CommentCaptureModel = require('./comment_capture.model')

exports.findOnePostObject = (postId) => {
  return CommentCaptureModel.findOne({_id: postId})
    .populate('pageId userId companyId')
    .exec()
}

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

exports.updatePostObject = (postId, payload) => {
  return CommentCaptureModel.updateOne({_id: postId}, payload)
    .exec()
}

exports.genericUpdatePostObject = (query, updated, options) => {
  return CommentCaptureModel.update(query, updated, options)
    .exec()
}

exports.deletePostObject = (postId) => {
  return CommentCaptureModel.deleteOne({_id: postId})
    .exec()
}

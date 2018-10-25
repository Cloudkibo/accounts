/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const TagsModel = require('./tags.model')

exports.findOneTagObjectUsingQuery = (queryObject) => {
  return TagsModel.findOne(queryObject)
    .populate('userId companyId')
    .exec()
}

exports.findAllTagObjectUsingQuery = (queryObject) => {
  return TagsModel.find(queryObject)
    .populate('userId companyId')
    .exec()
}

exports.deleteTagObjectUsingQuery = (query) => {
  return TagsModel.deleteMany(query)
    .exec()
}

exports.deleteOneTagObjectUsingQuery = (query) => {
  return TagsModel.findOneAndDelete(query)
    .exec()
}

exports.CountTagObjectUsingQuery = (query) => {
  return TagsModel.count(query)
    .exec()
}

exports.createTagObject = (payload) => {
  let obj = new TagsModel(payload)
  return obj.save()
}

exports.genericUpdateTagObject = (query, updated, options) => {
  return TagsModel.update(query, updated, options)
    .exec()
}

exports.findTagObjectUsingAggregate = (aggregateObject) => {
  return TagsModel.aggregate(aggregateObject)
    .exec()
}

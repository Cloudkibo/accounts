/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const TagsSubscriberModel = require('./tags_subscriber.model')

exports.findOneTagSubObjectUsingQuery = (queryObject) => {
  return TagsSubscriberModel.findOne(queryObject)
    .populate('subscriberId companyId')
    .exec()
}

exports.findAllTagSubObjectUsingQuery = (queryObject) => {
  return TagsSubscriberModel.find(queryObject)
    .populate('subscriberId companyId')
    .exec()
}

exports.deleteTagSubObjectUsingQuery = (query) => {
  return TagsSubscriberModel.deleteMany(query)
    .exec()
}

exports.deleteOneTagSubObjectUsingQuery = (query) => {
  return TagsSubscriberModel.findOneAndDelete(query)
    .exec()
}

exports.CountTagSubObjectUsingQuery = (query) => {
  return TagsSubscriberModel.count(query)
    .exec()
}

exports.createTagSubObject = (payload) => {
  let obj = new TagsSubscriberModel(payload)
  return obj.save()
}

exports.genericUpdateTagSubObject = (query, updated, options) => {
  return TagsSubscriberModel.update(query, updated, options)
    .exec()
}

exports.findTagSubObjectUsingAggregate = (aggregateObject) => {
  return TagsSubscriberModel.aggregate(aggregateObject)
    .exec()
}

/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const CodeAnalyticsModel = require('./code_analytics.model')

exports.createCodeAnalyticsObject = (payload) => {
  let obj = new CodeAnalyticsModel(payload)
  return obj.save()
}

exports.findCodeAnalyticsObjects = (query) => {
  return CodeAnalyticsModel.find(query)
    .exec()
}

exports.findOneCodeAnalyticsObjects = (query) => {
  return CodeAnalyticsModel.findOne(query)
    .exec()
}

exports.genericUpdateCodeAnalyticsObject = (query, updated, options) => {
  return CodeAnalyticsModel.updateMany(query, updated, options)
    .exec()
}

exports.genericUpdateOneObject = (query, updated, options) => {
  return CodeAnalyticsModel.updateOne(query, updated, options)
    .exec()
}

exports.aggregateInfo = (query) => {
  return CodeAnalyticsModel.aggregate(query)
    .exec()
}

exports.delete = (query) => {
  return CodeAnalyticsModel.deleteMany(query)
    .exec()
}

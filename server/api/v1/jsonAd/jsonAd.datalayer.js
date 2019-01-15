/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const JsonAdModel = require('./jsonAd.model')

exports.findOneUsingQuery = (queryObject) => {
  return JsonAdModel.findOne(queryObject)
    .exec()
}

exports.findAllUsingQuery = (queryObject) => {
  return JsonAdModel.find(queryObject)
    .populate('pageId companyId')
    .exec()
}

exports.deleteUsingQuery = (query) => {
  return JsonAdModel.deleteMany(query)
    .exec()
}

exports.deleteOneUsingQuery = (query) => {
  return JsonAdModel.deleteOne(query)
    .exec()
}

exports.countUsingQuery = (query) => {
  return JsonAdModel.count(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new JsonAdModel(payload)
  return obj.save()
}

exports.update = (query, updated, options) => {
  return JsonAdModel.update(query, updated, options)
    .exec()
}

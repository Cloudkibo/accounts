/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const JsonPostbackPayloadModel = require('./jsonPostbackPayload.model')

exports.findOneUsingQuery = (queryObject) => {
  return JsonPostbackPayloadModel.findOne(queryObject)
    .exec()
}

exports.findAllUsingQuery = (queryObject) => {
  return JsonPostbackPayloadModel.find(queryObject)
    .exec()
}

exports.deleteUsingQuery = (query) => {
  return JsonPostbackPayloadModel.deleteMany(query)
    .exec()
}

exports.deleteOneUsingQuery = (query) => {
  return JsonPostbackPayloadModel.deleteOne(query)
    .exec()
}

exports.countUsingQuery = (query) => {
  return JsonPostbackPayloadModel.count(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new JsonPostbackPayloadModel(payload)
  return obj.save()
}

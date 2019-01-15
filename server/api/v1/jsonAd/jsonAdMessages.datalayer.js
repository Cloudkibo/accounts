/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const JsonAdMessages = require('./jsonAdMessages.model')

exports.findOneUsingQuery = (queryObject) => {
  return JsonAdMessages.findOne(queryObject)
    .exec()
}

exports.findAllUsingQuery = (queryObject) => {
  return JsonAdMessages.find(queryObject)
    .exec()
}

exports.deleteUsingQuery = (query) => {
  return JsonAdMessages.deleteMany(query)
    .exec()
}

exports.deleteOneUsingQuery = (query) => {
  return JsonAdMessages.deleteOne(query)
    .exec()
}

exports.countUsingQuery = (query) => {
  return JsonAdMessages.count(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new JsonAdMessages(payload)
  return obj.save()
}

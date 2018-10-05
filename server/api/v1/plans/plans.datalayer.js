/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const PlansModel = require('./plans.model')

exports.findOnePlanObject = (planId) => {
  return PlansModel.findOne({_id: planId})
    .exec()
}

exports.findAllPlanObject = () => {
  return PlansModel.find({})
    .exec()
}

exports.findOnePlanObjectUsingQuery = (queryObject) => {
  return PlansModel.findOne(queryObject)
    .exec()
}

exports.findAllPlanObjectsUsingQuery = (queryObject) => {
  return PlansModel.find(queryObject)
    .exec()
}

exports.findPlanObjectUsingAggregate = (aggregateObject) => {
  return PlansModel.aggregate(aggregateObject)
    .exec()
}

exports.createPlanObject = (payload) => {
  let obj = new PlansModel(payload)
  return obj.save()
}

exports.updatePlanObject = (planId, payload) => {
  return PlansModel.updateOne({_id: planId}, payload)
    .exec()
}

exports.genericUpdatePlanObject = (query, updated, options) => {
  return PlansModel.update(query, updated, options)
    .exec()
}

exports.genericUpdateOnePlanObject = (query, updated, options) => {
  return PlansModel.updateOne(query, updated)
    .exec()
}

exports.deletePlanObject = (planId) => {
  return PlansModel.deleteOne({_id: planId})
    .exec()
}

exports.deletePlanObjectUsingQuery = (query) => {
  return PlansModel.deleteOne(query)
    .exec()
}

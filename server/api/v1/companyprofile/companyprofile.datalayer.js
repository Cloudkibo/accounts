/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const CompanyProfileModel = require('./companyprofile.model')

exports.findOneCPWithPlanPop = (query, populate, parameter) => {
  if (populate) {
    return CompanyProfileModel.findOne(query)
      .populate(parameter)
      .exec()
  } else {
    return CompanyProfileModel.findOne(query)
      .exec()
  }
}

exports.findAllProfileObjectsUsingQuery = (queryObject) => {
  return CompanyProfileModel.find(queryObject)
    .populate('planId')
    .exec()
}

exports.findPostObjectUsingAggregate = (aggregateObject) => {
  return CompanyProfileModel.aggregate(aggregateObject)
    .exec()
}

exports.createProfileObject = (payload) => {
  let obj = new CompanyProfileModel(payload)
  return obj.save()
}

exports.findOneProfileAndUpdate = (query, update, options) => {
  return CompanyProfileModel.findOneAndUpdate(query, update, options)
    .exec()
}

exports.deletePostObject = (postId) => {
  return CompanyProfileModel.deleteOne({_id: postId})
    .exec()
}

exports.genericUpdatePostObject = (query, updated, options) => {
  return CompanyProfileModel.update(query, updated, options)
    .exec()
}

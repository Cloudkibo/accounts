/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const CompanyUserModel = require('./companyuser.model')

exports.CreateCompanyUserObject = (payload) => {
  let obj = new CompanyUserModel(payload)
  return obj.save()
}

exports.findAllCompanyUserObjectUsingQuery = (queryObject) => {
  return CompanyUserModel.find(queryObject)
    .populate('userId')
    .exec()
}

exports.removeOneCompanyUserObjectUsingQuery = (queryObject) => {
  return CompanyUserModel.findOneAndRemove(queryObject)
    .exec()
}

exports.findOneCompanyUserObjectUsingQueryPoppulate = (queryObject) => {
  console.log('queryObject', queryObject.populate)
  if (queryObject.populate) {
    let populateBy = queryObject.populate
    delete queryObject.populate
    return CompanyUserModel.findOne(queryObject)
      .populate(populateBy)
      .exec()
  } else {
    return CompanyUserModel.findOne(queryObject)
      .exec()
  }
}

exports.updateOneCompanyUserObjectUsingQuery = (query, updated, options) => {
  return CompanyUserModel.updateOne(query, updated, options)
    .exec()
}
exports.aggregateInfo = (query) => {
  return CompanyUserModel.aggregate(query)
    .exec()
}

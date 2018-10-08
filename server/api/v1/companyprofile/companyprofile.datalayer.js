/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const CompanyProfileModel = require('./companyprofile.model')

exports.findOneCompanyProfileObject = (Id) => {
  return CompanyProfileModel.findOne({_id: Id})
    .exec()
}

exports.findOneCompanyProfileObjectUsingQuery = (queryObject) => {
  return CompanyProfileModel.findOne(queryObject)
    .exec()
}

exports.findAllProfileObjectsUsingQuery = (queryObject) => {
  return CompanyProfileModel.find(queryObject)
    .exec()
}

exports.findPostObjectUsingAggregate = (aggregateObject) => {
  return CompanyProfileModel.aggregate(aggregateObject)
    .exec()
}

exports.createPostObject = (payload) => {
  let obj = new CompanyProfileModel(payload)
  return obj.save()
}

exports.findOneProfileAndUpdate = (query, update, options) => {
  return CompanyProfileModel.findOneAndUpdate(query, update, options)
    .exec()
}

exports.genericUpdateCompanyProfileObject = (query, updated, options) => {
  return CompanyProfileModel.update(query, updated, options)
    .exec()
}

exports.deletePostObject = (postId) => {
  return CompanyProfileModel.deleteOne({_id: postId})
    .exec()
}

exports.saveProfileObject = (object) => {
  return object.save()
}

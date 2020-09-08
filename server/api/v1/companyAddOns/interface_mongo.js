/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const CompanyAddsOnsModel = require('./companyAddOns.model')

exports.find = (criteria = {}) => {
  return CompanyAddsOnsModel.find(criteria)
    .exec()
}

exports.findOne = (criteria) => {
  return CompanyAddsOnsModel.findOne(criteria)
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return CompanyAddsOnsModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return CompanyAddsOnsModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return CompanyAddsOnsModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return CompanyAddsOnsModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new CompanyAddsOnsModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return CompanyAddsOnsModel.aggregate(query)
    .exec()
}

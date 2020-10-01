/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const AddOnsModel = require('./addOns.model')

exports.find = (criteria = {}) => {
  return AddOnsModel.find(criteria)
    .exec()
}

exports.findOne = (criteria) => {
  return AddOnsModel.findOne(criteria)
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return AddOnsModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return AddOnsModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return AddOnsModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return AddOnsModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new AddOnsModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return AddOnsModel.aggregate(query)
    .exec()
}

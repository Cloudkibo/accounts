/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const FacebookShopsModel = require('./facebookShops.model')

exports.find = (criteria = {}) => {
  return FacebookShopsModel.find(criteria)
    .exec()
}

exports.findOne = (criteria) => {
  return FacebookShopsModel.findOne(criteria)
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return FacebookShopsModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return FacebookShopsModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return FacebookShopsModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return FacebookShopsModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new FacebookShopsModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return FacebookShopsModel.aggregate(query)
    .exec()
}

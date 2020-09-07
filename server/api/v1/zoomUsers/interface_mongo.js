/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const ZoomUsersModel = require('./zoomUsers.model')

exports.find = (criteria = {}) => {
  return ZoomUsersModel.find(criteria)
    .exec()
}

exports.findOne = (criteria) => {
  return ZoomUsersModel.findOne(criteria)
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return ZoomUsersModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return ZoomUsersModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return ZoomUsersModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return ZoomUsersModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new ZoomUsersModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return ZoomUsersModel.aggregate(query)
    .exec()
}

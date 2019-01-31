/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const CustomFieldModel = require('./custom_field.model')

exports.find = (criteria = {}) => {
  return CustomFieldModel.find(criteria)
    .populate('createdBy')
    .exec()
}

exports.findOne = (criteria) => {
  return CustomFieldModel.findOne(criteria)
    .populate('createdBy')
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return CustomFieldModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return CustomFieldModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return CustomFieldModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return CustomFieldModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new CustomFieldModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return CustomFieldModel.aggregate(query)
    .exec()
}

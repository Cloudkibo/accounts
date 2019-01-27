/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const CustomFieldSubscriberModel = require('./custom_field_subscriber.model')

exports.find = (criteria = {}) => {
  return CustomFieldSubscriberModel.find(criteria)
    .populate(
      'customFieldId',
      'subscriberId'
    )
    .exec()
}

exports.findOne = (criteria) => {
  return CustomFieldSubscriberModel.findOne(criteria)
    .populate(
      'customFieldId',
      'subscriberId'
    )
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return CustomFieldSubscriberModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return CustomFieldSubscriberModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return CustomFieldSubscriberModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return CustomFieldSubscriberModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new CustomFieldSubscriberModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return CustomFieldSubscriberModel.aggregate(query)
    .exec()
}

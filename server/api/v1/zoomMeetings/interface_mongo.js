/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const ZoomMeetingsModel = require('./zoomMeetings.model')

exports.find = (criteria = {}) => {
  return ZoomMeetingsModel.find(criteria)
    .exec()
}

exports.findOne = (criteria) => {
  return ZoomMeetingsModel.findOne(criteria)
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return ZoomMeetingsModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return ZoomMeetingsModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return ZoomMeetingsModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return ZoomMeetingsModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new ZoomMeetingsModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return ZoomMeetingsModel.aggregate(query)
    .exec()
}

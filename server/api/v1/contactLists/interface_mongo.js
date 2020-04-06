/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const ContactListModel = require('./contactLists.model')

exports.find = (criteria = {}) => {
  return ContactListModel.find(criteria)
    .exec()
}

exports.findOne = (criteria) => {
  return ContactListModel.findOne(criteria)
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return ContactListModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return ContactListModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return ContactListModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return ContactListModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new ContactListModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return ContactListModel.aggregate(query)
    .exec()
}

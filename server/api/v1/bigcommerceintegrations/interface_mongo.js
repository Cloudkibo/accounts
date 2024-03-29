/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const BigCommerce = require('./bigcommerce.model')

exports.find = (criteria = {}) => {
  return BigCommerce.find(criteria)
    .exec()
}

exports.findOne = (criteria) => {
  return BigCommerce.findOne(criteria)
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return BigCommerce.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return BigCommerce.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return BigCommerce.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return BigCommerce.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new BigCommerce(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return BigCommerce.aggregate(query)
    .exec()
}

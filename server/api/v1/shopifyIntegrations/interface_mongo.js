/*
This file will contain the functions for MongoDB interface.
By separating it from data layer, we are separating the concerns.
Thus Our web layer is agnostic of database
*/
const ShopifyModel = require('./shopify.model')

exports.find = (criteria = {}) => {
  return ShopifyModel.find(criteria)
    .exec()
}

exports.findOne = (criteria) => {
  return ShopifyModel.findOne(criteria)
    .exec()
}

exports.findOneAndUpdate = (query, updated, options) => {
  return ShopifyModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.updateMany = (query, updated, options) => {
  return ShopifyModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteOne = (query) => {
  return ShopifyModel.deleteOne(query)
    .exec()
}

exports.deleteMany = (query) => {
  return ShopifyModel.deleteMany(query)
    .exec()
}

exports.create = (payload) => {
  let obj = new ShopifyModel(payload)
  return obj.save()
}

exports.aggregate = (query) => {
  return ShopifyModel.aggregate(query)
    .exec()
}

/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const SubscriberModel = require('./Subscribers.model')
const logger = require('./../../../components/logger')

const util = require('util')

exports.findOneSubscriberObject = (subscriberId) => {
  return SubscriberModel.findOne({_id: subscriberId})
    .populate('pageId')
    .exec()
}

exports.findSubscriberObjects = (query) => {
  return SubscriberModel.find(query)
    .populate('pageId')
    .exec()
}

exports.aggregateInfo = (query) => {
  return SubscriberModel.aggregate(query)
    .exec()
}

exports.createSubscriberObject = (payload) => {
  let obj = new SubscriberModel(payload)
  return obj.save()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updateSubscriberObject = (subscriberId, payload) => {
  return SubscriberModel.updateOne({_id: subscriberId}, payload)
    .exec()
}

exports.genericUpdateSubscriberObject = (query, updated, options) => {
  return SubscriberModel.update(query, updated, options)
    .exec()
}

exports.genericUpdateSubscriberObjectAll = (query, updated, options) => {
  return SubscriberModel.updateMany(query, updated, options)
    .exec()
}

exports.deleteSubscriberObject = (subscriberId) => {
  return SubscriberModel.deleteOne({_id: subscriberId})
    .exec()
}

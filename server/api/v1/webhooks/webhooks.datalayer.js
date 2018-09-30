/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const WebhookModel = require('./Webhooks.model')

exports.findOneWebhookObject = (webhookId) => {
  return WebhookModel.findOne({_id: webhookId})
    .exec()
}

exports.findWebhookObjects = (query) => {
  return WebhookModel.find(query)
    .exec()
}

exports.aggregateInfo = (query) => {
  return WebhookModel.aggregate(query)
    .exec()
}

exports.createWebhookObject = (payload) => {
  return new WebhookModel(payload).save()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updateWebhookObject = (webhookId, payload) => {
  return WebhookModel.updateOne({_id: webhookId}, payload)
    .exec()
}

exports.deleteWebhookObject = (webhookId) => {
  return WebhookModel.deleteOne({_id: webhookId})
    .exec()
}

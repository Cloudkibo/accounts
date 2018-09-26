/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const SubscriberModel = require('./Subscribers.model')

exports.findOneSubscriberObject = (subscriberId) => {
  return SubscriberModel.findOne({_id: subscriberId})
    .exec()
}

exports.findSubscriberObjects = (query) => {
  return SubscriberModel.find(query)
    .exec()
}

exports.aggregateInfo = (query) => {
  return SubscriberModel.aggregate(query)
    .exec()
}

exports.createSubscriberObject = (pageScopedId, firstName, lastName, locale, timezone,
  email, gender, senderId, profilePic, coverPhoto, pageId, phoneNumber, unSubscribedBy,
  source, companyId, isSubscribed, isEnabledByPage) => {
  let payload = { pageScopedId,
    firstName,
    lastName,
    locale,
    timezone,
    email,
    gender,
    senderId,
    profilePic,
    coverPhoto,
    pageId,
    phoneNumber,
    unSubscribedBy,
    source,
    companyId,
    isSubscribed,
    isEnabledByPage }

  let obj = new SubscriberModel(payload)
  return obj.save()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updateSubscriberObject = (subscriberId, payload) => {
  return SubscriberModel.updateOne({_id: subscriberId}, payload)
    .exec()
}

exports.deleteSubscriberObject = (subscriberId) => {
  return SubscriberModel.deleteOne({_id: subscriberId})
    .exec()
}

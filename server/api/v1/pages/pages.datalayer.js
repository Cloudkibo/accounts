/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const PageModel = require('./Pages.model')

exports.findOnePageObject = (id) => {
  return PageModel.findOne({_id: id})
    .populate('userId')
    .exec()
}

exports.findOnePageObjectUsingQuery = (query) => {
  return PageModel.findOne(query)
    .populate('userId')
    .exec()
}

exports.findPageObjects = (query) => {
  return PageModel.find(query)
    .populate('userId')
    .exec()
}

exports.aggregateInfo = (query) => {
  return PageModel.aggregate(query)
    .exec()
}

exports.createPageObject = (pageId, pageName, pageUserName, pagePic, likes, accessToken,
  connected, userId, companyId, greetingText, welcomeMessage, isWelcomeMessageEnabled,
  gotPageSubscriptionPermission) => {
  let payload = { pageId,
    pageName,
    pageUserName,
    pagePic,
    likes,
    accessToken,
    connected,
    userId,
    companyId,
    greetingText,
    welcomeMessage,
    isWelcomeMessageEnabled,
    gotPageSubscriptionPermission }
  let obj = new PageModel(payload)
  return obj.save()
}

exports.createPageObject = (pageId, pageName, pageUserName, pagePic, likes, accessToken,
  connected, userId, companyId, greetingText, welcomeMessage, isWelcomeMessageEnabled,
  gotPageSubscriptionPermission) => {
  let payload = { pageId,
    pageName,
    pageUserName,
    pagePic,
    likes,
    accessToken,
    connected,
    userId,
    companyId,
    greetingText,
    welcomeMessage,
    isWelcomeMessageEnabled,
    gotPageSubscriptionPermission }
  let obj = new PageModel(payload)
  return obj.save()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updatePageObject = (id, payload) => {
  return PageModel.updateOne({_id: id}, payload)
    .exec()
}

exports.genericUpdatePageObject = (query, updated, options) => {
  return PageModel.update(query, updated, options)
    .exec()
}

exports.updatePageObjectUsingQuery = (query, payload, options) => {
  return PageModel.update(query, payload, options)
}

exports.deletePageObject = (id) => {
  return PageModel.deleteOne({_id: id})
    .exec()
}
exports.savePageObject = (payload) => {
  let obj = new PageModel(payload)
  return obj.save()
}

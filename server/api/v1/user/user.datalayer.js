/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const UserModel = require('./user.model')

exports.findOneUserObject = (userId) => {
  return UserModel.findOne({_id: userId})
    .exec()
}

exports.findAllUserObjects = () => {
  return UserModel.find()
    .exec()
}

exports.findAllUserObjectsUsingQuery = (query) => {
  return UserModel.find(query)
    .exec()
}

exports.findOneUserObjectUsingQuery = (query) => {
  return UserModel.findOne(query)
    .exec()
}

exports.saveUserObject = (object) => {
  return object.save()
}

exports.createUserObject = (payload) => {
  let obj = new UserModel(payload)
  return obj.save()
}

exports.findOneUserByEmail = (body) => {
  return UserModel.findOne({email: {$regex: `^${body.email}$`, $options: 'i'}})
    .exec()
}

exports.findOneUserByDomain = (body) => {
  return UserModel.findOne({domain: {$regex: `^${body.domain}$`, $options: 'i'}})
    .exec()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updateUserObject = (userId, payload, options = {}) => {
  return UserModel.updateOne({_id: userId}, {deleteInformation: payload}, options)
    .exec()
}

exports.updateOneUserObjectUsingQuery = (query, updated, options) => {
  return UserModel.updateOne(query, updated, options)
    .exec()
}

exports.findOneAndUpdateUsingQuery = (query, updated, options) => {
  return UserModel.findOneAndUpdate(query, updated, options)
    .exec()
}

exports.genericUpdateUserObject = (query, updated, options) => {
  return UserModel.update(query, updated, options)
    .exec()
}

exports.deleteUserObject = (userId) => {
  return UserModel.deleteOne({_id: userId})
    .exec()
}

exports.deleteUserObjectUsingQuery = (query) => {
  return UserModel.findOneAndRemove(query)
    .exec()
}

exports.CountUserObjectUsingQuery = (query) => {
  return UserModel.count(query)
    .exec()
}
exports.aggregateInfo = (query) => {
  return UserModel.aggregate(query)
    .exec()
}
exports.distinctQuery = (query) => {
  return UserModel.distinct(query)
    .exec()
}

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

exports.createUserObject = (payload) => {
  let obj = new UserModel(payload)
  return obj.save()
}

exports.findOneUserByEmail = (body) => {
  return UserModel.findOne({email: body.email})
    .exec()
}

exports.findOneUserByDomain = (body) => {
  return UserModel.findOne({domain: body.domain})
    .exec()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updateUserObject = (userId, payload) => {
  return UserModel.updateOne({_id: userId}, payload)
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

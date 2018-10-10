/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const InvitationsModel = require('./invitations.model')

exports.findOneInvitationsObjectUsingQuery = (queryObject) => {
  return InvitationsModel.findOne(queryObject)
    .exec()
}

exports.findAllInvitationsObjectUsingQuery = (queryObject) => {
  return InvitationsModel.findOne(queryObject)
    .exec()
}

exports.deleteInvitationObjectUsingQuery = (query) => {
  return InvitationsModel.deleteMany(query)
    .exec()
}

exports.deleteOneInvitationObjectUsingQuery = (query) => {
  return InvitationsModel.deleteOne(query)
    .exec()
}

exports.CountInvitationObjectUsingQuery = (query) => {
  return InvitationsModel.count(query)
    .exec()
}

exports.createInvitationObject = (payload) => {
  let obj = new InvitationsModel(payload)
  return obj.save()
}

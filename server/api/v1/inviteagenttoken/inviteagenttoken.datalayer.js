/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const InviteAgentTokenModel = require('./inviteagenttoken.model')

exports.findOneCompanyUserObjectUsingQuery = (queryObject) => {
  return InviteAgentTokenModel.findOne(queryObject)
    .exec()
}

exports.deleteInvitationTokenObjectUsingQuery = (query) => {
  return InviteAgentTokenModel.deleteMany(query)
    .exec()
}

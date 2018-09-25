/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const ResetTokenModel = require('./passwordresettoken.model')

exports.createResetTokenObject = (payload) => {
  let obj = new ResetTokenModel(payload)
  return obj.save()
}

exports.findResetTokenObjectUsingToken = (token) => {
  return ResetTokenModel.findOne({token: token})
    .exec()
}

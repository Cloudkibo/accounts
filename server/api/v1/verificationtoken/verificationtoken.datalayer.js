/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const VerificationTokenModel = require('./verificationtoken.model')

exports.findOneVerificationTokenObject = (query) => {
  return VerificationTokenModel.findOne(query)
    .exec()
}

exports.createVerificationToken = (payload) => {
  let obj = new VerificationTokenModel(payload)
  return obj.save()
}

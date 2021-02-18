/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const EmailVerificationModel = require('./email_verification_otps.model')

exports.findOneOtpObject = (query) => {
  return EmailVerificationModel.findOne(query)
    .exec()
}

exports.createVerificationOtp = (payload) => {
  let obj = new EmailVerificationModel(payload)
  return obj.save()
}

exports.deleteVerificationOtp = (otpId) => {
  return EmailVerificationModel.deleteOne({ _id: otpId })
    .exec()
}

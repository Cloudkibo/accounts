/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
let mongoose = require('mongoose')

exports.prepareUpdateUserPayload = (name, password, email, uiMode) => {
  let flag = true
  let temp = {}
  name ? temp.name = name : flag = false
  password ? temp.password = password : flag = false
  email ? temp.email = email : flag = false
  uiMode ? temp.uiMode = uiMode : flag = false

  return temp
}

exports.validateAndConvert = (body) => {
  let obj = body
  if (body[0].$match.companyId) {
    obj[0].$match.companyId = mongoose.Types.ObjectId(body[0].$match.companyId)
  }
  return obj
}

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
  let newBody = body

  body.forEach((obj, index) => {
    console.log('PageId', obj.$match)
    if (obj.$match && obj.$match.companyId) {
      newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
    }
    if (obj.$match && obj.$match.pageId) {
      newBody[index].$match.pageId = mongoose.Types.ObjectId(newBody[index].$match.pageId)
    }
    if (obj.$match && obj.$match['pageId._id']) {
      newBody[index].$match['pageId._id'] = mongoose.Types.ObjectId(newBody[index].$match['pageId._id'])
    }
  })
  return newBody
}

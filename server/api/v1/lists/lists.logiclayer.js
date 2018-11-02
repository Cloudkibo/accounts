/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
let mongoose = require('mongoose')

exports.validateAndConvert = (body) => {
  let newBody = body

  body.forEach((obj, index) => {
    if (obj.$match && obj.$match.companyId) {
      newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
    }
    if (obj.$match && obj.$match.$and) {
      let temp = obj.$match.$and
      temp.forEach((object, i) => {
        if (object.companyId) {
          newBody[index].$match.$and[i].companyId = mongoose.Types.ObjectId(newBody[index].$match.$and[i].companyId)
        }
        if (object._id && object._id.$gt) {
          newBody[index].$match.$and[i]._id.$gt = mongoose.Types.ObjectId(newBody[index].$match.$and[i]._id.$gt)
        }
      })
    }
  })
  return newBody
}

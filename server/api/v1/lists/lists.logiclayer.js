/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
let mongoose = require('mongoose')

exports.validateAndConvert = (body) => {
  console.log('body in validateAndConvert', JSON.stringify(body))
  let newBody = body

  body.forEach((obj, index) => {
    if (obj.$match && obj.$match.companyId) {
      newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
    }
  })
  if (body.$match && body.$match.$and) {
    let temp = body.$match.$and
    temp.forEach((obj, index) => {
      if (obj.companyId) {
        newBody.$match.$and[index].companyId = mongoose.Types.ObjectId(newBody.$match.$and[index].companyId)
      }
      if (obj._id && obj._id.$gt) {
        newBody.$match.$and[index]._id.$gt = mongoose.Types.ObjectId(newBody.$match.$and[index]._id.$gt)
      }
    })
  }
  console.log('newBody', JSON.stringify(newBody))
  return newBody
}

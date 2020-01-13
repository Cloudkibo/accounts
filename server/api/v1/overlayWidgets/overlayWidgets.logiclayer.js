/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
let mongoose = require('mongoose')

exports.validateAndConvert = (body) => {
  let newBody = body

  body.forEach((obj, index) => {
    if (obj.$match) {
      if (obj.$match.companyId) {
        newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
      }
      if (obj.$match.userId) {
        newBody[index].$match.userId = mongoose.Types.ObjectId(newBody[index].$match.userId)
      }
      if (obj.$match._id && !obj.$match._id.$exists) {
        newBody[index].$match._id = mongoose.Types.ObjectId(newBody[index].$match._id)
      }
      if (obj.$match.pageId && !obj.$match.pageId.$exists) {
        newBody[index].$match.pageId = mongoose.Types.ObjectId(newBody[index].$match.pageId)
      }
      if (obj.$match && obj.$match.$and) {
        obj.$match.$and.forEach((object, index1) => {
          if (object.companyId) {
            newBody[index].$match.$and[index1].companyId = mongoose.Types.ObjectId(newBody[index].$match.$and[index1].companyId)
          }
          if (object['pageId'] && !object['pageId'].$exists) {
            newBody[index].$match.$and[index1]['pageId'] = mongoose.Types.ObjectId(newBody[index].$match.$and[index1]['pageId'])
          }
          if (object._id && object._id.$gt) {
            newBody[index].$match.$and[index1]._id.$gt = mongoose.Types.ObjectId(newBody[index].$match.$and[index1]._id.$gt)
          }
          if (object._id && object._id.$lt) {
            newBody[index].$match.$and[index1]._id.$lt = mongoose.Types.ObjectId(newBody[index].$match.$and[index1]._id.$lt)
          }
          if (object.userId) {
            newBody[index].$match.$and[index1].userId = mongoose.Types.ObjectId(newBody[index].$match.$and[index1].userId)
          }
        })
      }
    }
  })
  return newBody
}

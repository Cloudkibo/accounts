let mongoose = require('mongoose')

exports.validateAndConvert = (body) => {
  let newBody = body

  body.forEach((obj, index) => {
    if (obj.$match && obj.$match.companyId) {
      newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
    }
    if (obj.$match && obj.$match.datetime) {
      if (obj.$match.datetime.$gte) {
        newBody[index].$match.datetime.$gte = new Date(newBody[index].$match.datetime.$gte)
      }
      if (obj.$match.datetime.$lt) {
        newBody[index].$match.datetime.$lt = new Date(newBody[index].$match.datetime.$lt)
      }
    }
    if (obj.$match && obj.$match.lastMessagedAt && obj.$match.lastMessagedAt.$lt) {
      newBody[index].$match.lastMessagedAt.$lt = new Date(newBody[index].$match.lastMessagedAt.$lt)
    }
    if (obj.$match && obj.$match.lastMessagedAt && obj.$match.lastMessagedAt.$gte) {
      newBody[index].$match.lastMessagedAt.$gte = new Date(newBody[index].$match.lastMessagedAt.$gte)
    }
    if (obj.$match && obj.$match.last_activity_time && obj.$match.last_activity_time.$lt) {
      newBody[index].$match.last_activity_time.$lt = new Date(newBody[index].$match.last_activity_time.$lt)
    }
    if (obj.$match && obj.$match.last_activity_time && obj.$match.last_activity_time.$gte) {
      newBody[index].$match.last_activity_time.$gte = new Date(newBody[index].$match.last_activity_time.$gte)
    }
    if (obj.$match && obj.$match.$and) {
      obj.$match.$and.forEach((object, index1) => {
        if (object.companyId) {
          newBody[index].$match.$and[index1].companyId = mongoose.Types.ObjectId(newBody[index].$match.$and[index1].companyId)
        }
        if (object._id && object._id.$gt) {
          newBody[index].$match.$and[index1]._id.$gt = mongoose.Types.ObjectId(newBody[index].$match.$and[index1]._id.$gt)
        }
        if (object._id && object._id.$lt) {
          newBody[index].$match.$and[index1]._id.$lt = mongoose.Types.ObjectId(newBody[index].$match.$and[index1]._id.$lt)
        }
      })
    }
  })
  return newBody
}

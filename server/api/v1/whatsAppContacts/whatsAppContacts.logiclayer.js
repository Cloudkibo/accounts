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

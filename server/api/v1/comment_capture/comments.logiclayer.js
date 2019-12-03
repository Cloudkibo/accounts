let mongoose = require('mongoose')

exports.validateAndConvert = (body) => {
  let newBody = body

  body.forEach((obj, index) => {
    if (obj.$match && obj.$match.postId) {
      newBody[index].$match.postId = mongoose.Types.ObjectId(newBody[index].$match.postId)
    }
    if (obj.$match && obj.$match.parentId && typeof obj.$match.parentId === 'string') {
      newBody[index].$match.parentId = mongoose.Types.ObjectId(newBody[index].$match.parentId)
    }
    if (obj.$match && obj.$match.datetime && !obj.$match.datetime.$exists) {
      if (obj.$match.datetime.$gt) {
        newBody[index].$match.datetime.$gt = new Date(newBody[index].$match.datetime.$gt)
      }
      if (obj.$match.datetime.$gte) {
        newBody[index].$match.datetime.$gte = new Date(newBody[index].$match.datetime.$gte)
      }
      if (obj.$match.datetime.$lt) {
        newBody[index].$match.datetime.$lt = new Date(newBody[index].$match.datetime.$lt)
      }
    }
    if (obj.$match && obj.$match._id && !obj.$match._id.$exists) {
      if (obj.$match._id.$gt) {
        newBody[index].$match._id.$gt = mongoose.Types.ObjectId(newBody[index].$match._id.$gt)
      }
      if (obj.$match._id.$lt) {
        newBody[index].$match._id.$lt = mongoose.Types.ObjectId(newBody[index].$match._id.$lt)
      }
    }
  })
  return newBody
}

/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
let mongoose = require('mongoose')

exports.validateCreatePayload = (body) => {
  let bool = true
  let arrayOfRequiredFields = [
    'name',
    'type',
    'companyId',
    'createdBy'
  ]
  let arrayOfKeys = Object.keys(body)

  arrayOfRequiredFields.forEach((field, index) => {
    if (!arrayOfKeys.includes(field)) {
      bool = false
    }
  })

  return bool
}

exports.prepareMongoAggregateQuery = (body) => {
  let newBody = body
  body.forEach((obj, index) => {
    if (obj.match) {
      if (obj.match.companyId) {
        newBody[index].match.companyId = mongoose.Types.ObjectId(newBody[index].match.companyId)
      }
      if (obj.match.createdBy) {
        newBody[index].match.createdBy = mongoose.Types.ObjectId(newBody[index].match.createdBy)
      }
      if (obj.match._id) {
        newBody[index].match._id = mongoose.Types.ObjectId(newBody[index].match._id)
      }
    }
  })
  return newBody
}

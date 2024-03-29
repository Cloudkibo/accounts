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
    'type'
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
  let query = []

  if (body.match) {
    if (body.match.companyId && !body.match.companyId.$exists) {
      body.match.companyId = mongoose.Types.ObjectId(body.match.companyId)
    }
    if (body.match.createdBy && !body.match.createdBy.$exists) {
      body.match.createdBy = mongoose.Types.ObjectId(body.match.createdBy)
    }
    if (body.match._id && !body.match._id.$exists) {
      body.match._id = mongoose.Types.ObjectId(body.match._id)
    }
    query.push({ $match: body.match })
  } else return 'Match Criteria Not Found'

  if (body.group) {
    if (!Object.keys(body.group).includes('_id')) return '_id is missing in Group Criteria'
    else query.push({ $group: body.group })
  }

  if (body.skip) query.push({ $skip: body.skip })
  if (body.sort) query.push({ $sort: body.sort })
  if (body.limit) query.push({ $limit: body.limit })

  return query
}

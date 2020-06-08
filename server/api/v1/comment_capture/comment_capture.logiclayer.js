/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
let mongoose = require('mongoose')

exports.preparePostPayload = (body) => {
  return {
    pageId: body.pageId,
    companyId: body.companyId,
    userId: body.userId,
    payload: body.payload,
    reply: body.reply,
    includedKeywords: body.includedKeywords,
    excludedKeywords: body.excludedKeywords,
    sendOnlyToNewSubscribers: body.sendOnlyToNewSubscribers
  }
}

exports.prepareUpdatePostPayload = (body) => {
  let temp = {}
  if (body.includedKeywords) temp.includedKeywords = body.includedKeywords
  if (body.excludedKeywords) temp.excludedKeywords = body.excludedKeywords
  return temp
}

exports.prepareMongoAggregateQuery = (body) => {
  if (body.length && body.length > 0) {
    let newBody = body
    body.forEach((obj, index) => {
      if (obj.$match && obj.$match.datetime && !obj.$match.datetime.$exists) {
        if (obj.$match.datetime.$gte) {
          newBody[index].$match.datetime.$gte = new Date(newBody[index].$match.datetime.$gte)
        }
        if (obj.$match.datetime.$lt) {
          newBody[index].$match.datetime.$lt = new Date(newBody[index].$match.datetime.$lt)
        }
      }
      if (obj.$match && obj.$match.companyId) {
        newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
      }
      if (obj.$match && obj.$match.pageId && obj.$match.pageId.$in) {
        obj.$match.pageId.$in.forEach((value, indexValue) => {
          newBody[index].$match.pageId.$in[indexValue] = mongoose.Types.ObjectId(newBody[index].$match.pageId.$in[indexValue])
        })
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
  } else {
    let query = []

    if (body.match) {
      if (Object.keys(body.match).includes('companyId')) {
        body.match.companyId = mongoose.Types.ObjectId(body.match.companyId)
      }
      query.push({$match: body.match})
    } else {
      return 'Match Criteria Not Found'
    }

    if (body.group) {
      if (!Object.keys(body.group).includes('_id')) return '_id is missing in Group Criteria'
      else query.push({$group: body.group})
    }

    if (body.skip) query.push({$skip: body.skip})
    if (body.sort) query.push({$sort: body.sort})
    if (body.limit) query.push({$limit: body.limit})

    return query
  }
}

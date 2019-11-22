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
    excludedKeywords: body.excludedKeywords
  }
}

exports.prepareUpdatePostPayload = (body) => {
  let temp = {}
  if (body.includedKeywords) temp.includedKeywords = body.includedKeywords
  if (body.excludedKeywords) temp.excludedKeywords = body.excludedKeywords
  return temp
}

exports.prepareMongoAggregateQuery = (body) => {
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
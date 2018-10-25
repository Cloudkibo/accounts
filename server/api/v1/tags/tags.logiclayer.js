/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const mongoose = require('mongoose')
const logger = require('../../../components/logger')
const TAG = 'api/v1/tags/tags.logiclayer.js'

exports.prepareCreatePayload = (body) => {
  let payload = {
    tag: body.tag,
    userId: body.userId,
    companyId: body.companyId
  }
  logger.serverLog(TAG, `going to return payload: ${payload}`)
  return payload
}

exports.validateAndConvert = (body) => {
  let newBody = body

  body.forEach((obj, index) => {
    if (obj.$match && obj.$match.companyId) {
      newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
    }
    if (obj.$match && obj.$match.userId) {
      newBody[index].$match.userId = mongoose.Types.ObjectId(newBody[index].$match.userId)
    }
  })
  return newBody
}

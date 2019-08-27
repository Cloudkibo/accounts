/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const mongoose = require('mongoose')
const logger = require('../../../components/logger')
const TAG = 'api/v1/tags_subscriber/tags_subscriber.logiclayer.js'

exports.prepareCreatePayload = (body) => {
  let payload = {
    tagId: body.tagId,
    subscriberId: body.subscriberId,
    companyId: body.companyId
  }
  logger.serverLog(TAG, `going to return payload: ${payload}`)
  return payload
}

exports.validateAndConvert = (body) => {
  let newBody = body

  body.forEach((obj, index) => {
    if (obj.$match['Subscribers.pageId'] && !obj.$match['Subscribers.pageId'].$exists) {
      console.log('newBody[index].$match.Subscribers.pageId', obj.$match['Subscribers.pageId'])
      newBody[index].$match['Subscribers.pageId'] = mongoose.Types.ObjectId(newBody[index].$match['Subscribers.pageId'])
    }
    if (obj.$match && obj.$match.$and) {
      obj.$match.$and.forEach((object, index1) => {
        if (object.companyId) {
          newBody[index].$match.$and[index1].companyId = mongoose.Types.ObjectId(newBody[index].$match.$and[index1].companyId)
        }
        if (object.pageId && !object.pageId.$exists) {
          newBody[index].$match.$and[index1].Subscribers.pageId = mongoose.Types.ObjectId(newBody[index].$match.$and[index1].Subscribers.pageId)
        }
        // if (object['pageId._id'] && !object['pageId._id'].$exists) {
        //   newBody[index].$match.$and[index1]['pageId._id'] = mongoose.Types.ObjectId(newBody[index].$match.$and[index1]['pageId._id'])
        // }
        if (object._id && object._id.$gt) {
          newBody[index].$match.$and[index1].Subscribers._id.$gt = mongoose.Types.ObjectId(newBody[index].$match.$and[index1].Subscribers._id.$gt)
        }
        if (object._id && object._id.$lt) {
          newBody[index].$match.$and[index1].Subscribers._id.$lt = mongoose.Types.ObjectId(newBody[index].$match.$and[index1].Subscribers._id.$lt)
        }
      })
    }
    if (obj.$match && obj.$match.companyId) {
      newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
    }
    if (obj.$match && obj.$match.subscriberId) {
      newBody[index].$match.subscriberId = mongoose.Types.ObjectId(newBody[index].$match.subscriberId)
    }


    if (obj.$match && obj.$match.tagId) {
    //  console.log('obj', obj.$match.tagId.$in)
      
      obj.$match.tagId.$in.forEach((tagID, index1) => {
        // console.log('obj.$match.tags_subscriber inside', tagID)
        newBody[index].$match.tagId.$in[index1] = mongoose.Types.ObjectId(tagID)
        // console.log('inside new body', newBody[index].$match.tags_subscriber.$elemMatch.tagId.$in)
        //newBody[index].$match.tagId.$in = mongoose.Types.ObjectId(newBody[index].$match.tagId)
      })
      
    }
  })
  return newBody
}

/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
let mongoose = require('mongoose')

exports.prepareUpdateUserPayload = (name, password, email, uiMode) => {
  let flag = true
  let temp = {}
  name ? temp.name = name : flag = false
  password ? temp.password = password : flag = false
  email ? temp.email = email : flag = false
  uiMode ? temp.uiMode = uiMode : flag = false

  return temp
}

exports.validateAndConvert = (body) => {
  let newBody = body

  body.forEach((obj, index) => {
    console.log('PageId', obj.$match)
    if (obj.$match && obj.$match.companyId) {
      newBody[index].$match.companyId = mongoose.Types.ObjectId(newBody[index].$match.companyId)
    }
    if (obj.$match && obj.$match.pageId && !obj.$match.pageId.$exists) {
      if (obj.$match.pageId.$in) {
        let pageIds = obj.$match.pageId.$in.map((p) => mongoose.Types.ObjectId(p))
        console.log('pageIds', pageIds)
        newBody[index].$match.pageId.$in = pageIds
      } else {
        newBody[index].$match.pageId = mongoose.Types.ObjectId(newBody[index].$match.pageId)
      }
    }
    if (obj.$match && obj.$match['pageId._id'] && !obj.$match['pageId._id'].$exists) {
      console.log('in pageId if')
      newBody[index].$match['pageId._id'] = mongoose.Types.ObjectId(newBody[index].$match['pageId._id'])
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
        if (object.pageId && !object.pageId.$exists) {
          newBody[index].$match.$and[index1].pageId = mongoose.Types.ObjectId(newBody[index].$match.$and[index1].pageId)
        }
        if (object['pageId._id'] && !object['pageId._id'].$exists) {
          newBody[index].$match.$and[index1]['pageId._id'] = mongoose.Types.ObjectId(newBody[index].$match.$and[index1]['pageId._id'])
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
  console.log('new body new', JSON.stringify(newBody))
  return newBody
}

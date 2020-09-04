const logger = require('../../../components/logger')
const logicLayer = require('./comment_capture.logiclayer')
const dataLayer = require('./comment_capture.datalayer')
const TAG = '/api/v1/comment_capture/comment_capture.controller.js'
const needle = require('needle')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')
const config = require('./../../../config/environment/index')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
var https = require('https')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find post controller index')

  dataLayer.findOnePostObjectUsingQuery({_id: req.params.id})
    .then(post => {
      sendSuccessResponse(res, 200, post)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create post controller index')
  dataLayer.createPostObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  let isTextComponent = false
  if(req.body.newPayload.postText){
    dataLayer.findOnePostObjectUsingQuery(req.body.query)
        .then(res => {
          let postPaylaods = res.payload
          let postPaylaodText
          for(let i=0; i<postPaylaods.length; i++){
            if(postPaylaods[i].componentType === 'text'){
              isTextComponent = true
              postPaylaods[i].text = req.body.newPayload.postText
            }
          }

          if(!isTextComponent){
            let newTextPayload = {
              componentType: 'text',
              text: req.body.newPayload.postText
            }
            postPaylaods.push(newTextPayload)
          }

        dataLayer.genericUpdatePostObject(req.body.query, {payload: postPaylaods}, req.body.options)
        .then(result => {
          //sendSuccessResponse(res, 200, result)
        })
        .catch(err => {
          logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
          sendErrorResponse(res, 500, err)
        })})
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)})
  }

  var updatePayload = {
    title: req.body.newPayload.title,
    includedKeywords: req.body.newPayload.includedKeywords,
    excludedKeywords: req.body.newPayload.excludedKeywords,
    secondReply: req.body.newPayload.secondReply,
    reply: req.body.newPayload.reply,
    sendOnlyToNewSubscribers: req.body.newPayload.sendOnlyToNewSubscribers
  }

  dataLayer.genericUpdatePostObject(req.body.query, updatePayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete post controller index')
  dataLayer.findOnePostObjectUsingQuery({_id: req.params.id})
    // delete post from database
    .then(result => {
      return dataLayer.deletePostObject(req.params.id)
    })
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

//This is only to delete from our database, not facebook
exports.deleteLocally = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete post locally controller index')

  // delete post from database
    dataLayer.deleteOneUsingQuery(req.body.post_id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findAllPostObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateFetch = function (req, res) {
  var query = logicLayer.prepareMongoAggregateQuery(req.body)
  dataLayer
    .findPostObjectUsingAggregate(query)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePostObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}
exports.upload = function (req, res) {
  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  var serverPath = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate()
  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()

  let dir = path.resolve(__dirname, '../../../../broadcastFiles/')
  var file = fs.createWriteStream(dir + '/userfiles/' + serverPath)
  var request = https.get(req.body.url, function (response) {
    let stream = response.pipe(file)
    stream.on('finish', () => {
      console.log('finished writing')
      let payload = {
        id: serverPath,
        name: serverPath,
        url: `${config.domain}/api/v1/files/download/${serverPath}`
      }
      sendSuccessResponse(res, 200, payload)
    })
  })
}

exports.scriptNormalizeAnalytics = function (req, res) {
  dataLayer.fetchAllPosts()
  .then(posts => {
    for(let i=0; i<posts.length; i++){
      if (posts[i].includedKeywords.length < 1 && posts[i].excludedKeywords.length < 1 ) {
        console.log(JSON.stringify(posts[i]))
        dataLayer.genericUpdatePostObject({_id: posts[i]._id}, {positiveMatchCount: posts[i].count}, {})
          .then(result => {
            logger.serverLog(TAG, `Result ${util.inspect(result)}`)
          })
          .catch(err => {
            logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
            sendErrorResponse(res, 500, err)
          })

      }
      if (i === posts.length -1) {
        sendSuccessResponse(res, 200, posts)
      }
    }
  })
  .catch(err => {
    logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
    sendErrorResponse(res, 500, err)
  })
}

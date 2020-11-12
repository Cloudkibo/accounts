const logger = require('../../../components/logger')
const jsonAdMessagesDataLayer = require('./jsonAdMessages.datalayer')
const JsonAdDataLayer = require('./jsonAd.datalayer')
const TAG = '/api/v1/menu/menu.controller.js'
const mongoose = require('mongoose')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  let messages = req.body.jsonAdMessages
  let requests = []
  let response = {
    jsonAd: {},
    jsonAdMessages: []
  }
  JsonAdDataLayer.create({
    title: req.body.title,
    companyId: req.user.companyId,
    userId: req.user.userId
  })
    .then(jsonAd => {
      response.jsonAd = jsonAd
      for (let i = 0; i < messages.length; i++) {
        requests.push(new Promise((resolve, reject) => {
          let message = messages[i]
          jsonAdMessagesDataLayer.create({
            jsonAdId: jsonAd._id,
            title: message.title,
            jsonAdMessageId: message.jsonAdMessageId,
            jsonAdMessageParentId: message.jsonAdMessageParentId,
            messageContent: message.messageContent
          }).then(jsonAdMessage => {
            response.jsonAdMessages.push(jsonAdMessage)
            resolve(jsonAdMessage)            
          }).catch(err => {
            reject(err)
          })
        }))
      }
      Promise.all(requests)
        .then((responses) => {
          let data = {
            jsonAd: response.jsonAd,
            jsonAdMessages: responses
          }
          sendSuccessResponse(res, 200, data)
        })
        .catch((err) => {
          const message = err || 'Failed to Create JsonAdd messages'
          logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          sendErrorResponse(res, 500, '', err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to Create Json Add'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
    })
}
exports.edit = function (req, res) {
  let messages = req.body.jsonAdMessages
  let requests = []

  let response = {
    jsonAd: {},
    jsonAdMessages: []
  }
  JsonAdDataLayer.findOneUsingQuery({_id: req.body.jsonAdId})
    .then(jsonAd => {
      jsonAdMessagesDataLayer.deleteUsingQuery({
        jsonAdId: req.body.jsonAdId
      }).then(deleted => {
        JsonAdDataLayer.deleteOneUsingQuery({_id: jsonAd._id})
          .then(deletedJsonAd => {
            JsonAdDataLayer.create({
              title: req.body.title,
              companyId: req.user.companyId,
              userId: req.user.userId
            })
              .then(createdJsonAd => {
                response.jsonAd = createdJsonAd
                for (let i = 0; i < messages.length; i++) {
                  requests.push(new Promise((resolve, reject) => {
                    let message = messages[i]
                    jsonAdMessagesDataLayer.create({
                      _id: mongoose.Types.ObjectId(message._id),
                      jsonAdId: createdJsonAd._id,
                      jsonAdMessageId: message.jsonAdMessageId,
                      title: message.title,
                      jsonAdMessageParentId: message.jsonAdMessageParentId,
                      messageContent: message.messageContent
                    }).then(jsonAdMessage => {
                      response.jsonAdMessages.push(jsonAdMessage)
                      resolve(jsonAdMessage)
                    }).catch(err => {
                      reject(err)
                    })
                  }))
                }
                Promise.all(requests)
                  .then((responses) => {
                    responses = {
                      jsonAd: response.jsonAd,
                      jsonAdMessages: responses
                    }
                    sendSuccessResponse(res, 200, responses)
                  })
                  .catch((err) => {
                    const message = err || 'Failed to create Json Add Messages'
                    logger.serverLog(message, `${TAG}: exports.edit`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
                    sendErrorResponse(res, 500, '', err)
                  })
              })
              .catch(err => {
                const message = err || 'Failed to Create Json Add'
                logger.serverLog(message, `${TAG}: exports.edit`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
                sendErrorResponse(res, 500, '', err)
              })
          })
          .catch(err => {
            const message = err || 'Failed to delete Json Add'
            logger.serverLog(message, `${TAG}: exports.edit`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
            sendErrorResponse(res, 500, '', err)
          })
      }).catch(err => {
        const message = err || 'Failed to delete Json Add Messages'
        logger.serverLog(message, `${TAG}: exports.edit`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
        sendErrorResponse(res, 500, '', err)
      })
    })
    .catch(err => {
      const message = err || 'Failed to Find Json Add'
      logger.serverLog(message, `${TAG}: exports.edit`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', err)
    })
}
exports.getAll = function (req, res) {
  JsonAdDataLayer.findAllUsingQuery({userId: req.user.userId})
    .then(response => {
      sendSuccessResponse(res, 200, response)
    })
    .catch(err => {
      const message = err || 'Failed to Fetch get All Json Add '
      logger.serverLog(message, `${TAG}: exports.getAll`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', err)
    })
}

exports.getJsonAdResponse = function (req, res) {
  let response = {}
  JsonAdDataLayer.findOneJsonAdMessageUsingQuery({_id: req.params.id})
    .then(jsonAd => {
      response.jsonAd = jsonAd
      jsonAdMessagesDataLayer.findAllUsingQuery({jsonAdId: req.params.id})
        .then(jsonAdMessages => {
          response.jsonAdMessages = jsonAdMessages
          sendSuccessResponse(res, 200, response)
        })
        .catch(err => {
          const message = err || 'Failed to Find Json Add Message'
          logger.serverLog(message, `${TAG}: exports.getJsonAdResponse`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          sendErrorResponse(res, 500, '', err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to Find Json Add'
      logger.serverLog(message, `${TAG}: exports.getJsonAdResponse`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', err)
    })
}

exports.getOne = function (req, res) {
  let response = {}
  JsonAdDataLayer.findOneUsingQuery({_id: req.params.id})
    .then(jsonAd => {
      response.jsonAd = jsonAd
      jsonAdMessagesDataLayer.findAllUsingQuery({jsonAdId: req.params.id})
        .then(jsonAdMessages => {
          response.jsonAdMessages = jsonAdMessages
          sendSuccessResponse(res, 200, response)
        })
        .catch(err => {
          const message = err || 'Failed to Find Json Add All Messages'
          logger.serverLog(message, `${TAG}: exports.getOne`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to Find Json Add'
      logger.serverLog(message, `${TAG}: exports.getOne`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.getJsonAdResponse = function (req, res) {
  jsonAdMessagesDataLayer.findOneUsingQuery({_id: req.params.id})
    .then(jsonAdMessage => {
      sendSuccessResponse(res, 200, jsonAdMessage)
    })
    .catch(err => {
      const message = err || 'Failed to Find Json Add All Messages'
      logger.serverLog(message, `${TAG}: exports.getJsonAdResponse`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.deleteOne = function (req, res) {
  JsonAdDataLayer.deleteOneUsingQuery({_id: req.params.id})
    .then(deletedAd => {
      jsonAdMessagesDataLayer.deleteUsingQuery({jsonAdId: req.params.id})
        .then(deletedMessages => {
          sendSuccessResponse(res, 200)
        })
        .catch(err => {
          const message = err || 'Failed to deleteOne Json Add All Messages'
          logger.serverLog(message, `${TAG}: exports.deleteOne`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to deleteOne Json Add'
      logger.serverLog(message, `${TAG}: exports.deleteOne`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  JsonAdDataLayer.findAllUsingQuery(req.body)
    .then(response => {
      sendSuccessResponse(res, 200, response)
    })
    .catch(err => {
      const message = err || 'Failed to Fetch All Json Add'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

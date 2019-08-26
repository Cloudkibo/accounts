const logger = require('../../../components/logger')
const jsonAdMessagesDataLayer = require('./jsonAdMessages.datalayer')
const JsonAdDataLayer = require('./jsonAd.datalayer')
const TAG = '/api/v1/menu/menu.controller.js'
const mongoose = require('mongoose')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create json ad endpoint')
  let messages = req.body.jsonAdMessages
  let requests = []
  let response = {
    jsonAd: {},
    jsonAdMessages: []
  }
  requests.push(new Promise((resolve, reject) => {
    JsonAdDataLayer.create({
      title: req.body.title,
      companyId: req.user.companyId,
      userId: req.user.userId
    })
      .then(jsonAd => {
        response.jsonAd = jsonAd
        for (let i = 0; i < messages.length; i++) {
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
            if (messages.length - 1 === i) {
              Promise.all(requests)
                .then((responses) => {
                  responses = {
                    jsonAd: responses[0],
                    jsonAdMessages: response.jsonAdMessages
                  }
                  sendSuccessResponse(res, 200, responses)
                })
                .catch((err) => sendErrorResponse(res, 500, '', err))
            }
          }).catch(err => {
            reject(err)
          })
        }
        resolve(jsonAd)
      })
      .catch(err => {
        reject(err)
      })
  }))
}

exports.edit = function (req, res) {
  logger.serverLog(TAG, 'Hit the edit json ad endpoint')

  let messages = req.body.jsonAdMessages
  let requests = []

  let response = {
    jsonAd: {},
    jsonAdMessages: []
  }
  JsonAdDataLayer.findOneUsingQuery({_id: req.body.jsonAdId})
    .then(jsonAd => {
      requests.push(new Promise((resolve, reject) => {
        jsonAdMessagesDataLayer.deleteUsingQuery({
          jsonAdId: req.body.jsonAdId
        }).then(deleted => {
          requests.push(new Promise((resolve, reject) => {
            JsonAdDataLayer.deleteOneUsingQuery({_id: jsonAd._id})
              .then(deletedJsonAd => {
                requests.push(new Promise((resolve, reject) => {
                  JsonAdDataLayer.create({
                    title: req.body.title,
                    companyId: req.user.companyId,
                    userId: req.user.userId
                  })
                    .then(createdJsonAd => {
                      response.jsonAd = createdJsonAd
                      for (let i = 0; i < messages.length; i++) {
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
                          if (messages.length - 1 === i) {
                            Promise.all(requests)
                              .then((responses) => {
                                responses = {
                                  jsonAd: responses[0],
                                  jsonAdMessages: response.jsonAdMessages
                                }
                                sendSuccessResponse(res, 200, responses)
                              })
                              .catch((err) => sendErrorResponse(res, 500, '', err))
                          }
                        }).catch(err => {
                          reject(err)
                        })
                      }
                      resolve(createdJsonAd)
                    })
                    .catch(err => {
                      reject(err)
                    })
                }))
                resolve(deletedJsonAd)
              })
              .catch(err => {
                reject(err)
              })
          }))
          resolve(deleted)
        }).catch(err => {
          reject(err)
        })
      }))
    })
    .catch(err => {
      sendErrorResponse(res, 500, '', err)
    })
}

exports.getAll = function (req, res) {
  JsonAdDataLayer.findAllUsingQuery({userId: req.user.userId})
    .then(response => {
      sendSuccessResponse(res, 200, response)
    })
    .catch(err => {
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
          sendErrorResponse(res, 500, '', err)
        })
    })
    .catch(err => {
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
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.getJsonAdResponse = function (req, res) {
  jsonAdMessagesDataLayer.findOneUsingQuery({_id: req.params.id})
    .then(jsonAdMessage => {
      sendSuccessResponse(res, 200, jsonAdMessage)
    })
    .catch(err => {
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
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  JsonAdDataLayer.findAllUsingQuery(req.body)
    .then(response => {
      sendSuccessResponse(res, 200, response)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

const logger = require('../../../components/logger')
const jsonAdMessagesDataLayer = require('./jsonAdMessages.datalayer')
const JsonAdDataLayer = require('./jsonAd.datalayer')
const TAG = '/api/v1/menu/menu.controller.js'
const mongoose = require('mongoose')

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create json ad endpoint')
  let messages = req.body.jsonAdMessages
  let requests = []
  let response = {
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
          requests.push(new Promise((resolve, reject) => {
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
        resolve(jsonAd)
        Promise.all(requests)
          .then((responses) => res.status(200).json({status: 'success', payload: response}))
          .catch((err) => res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`}))
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
                        requests.push(new Promise((resolve, reject) => {
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
                                .then((responses) => res.status(200).json({status: 'success', payload: response}))
                                .catch((err) => res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`}))
                            }
                          }).catch(err => {
                            reject(err)
                          })
                        }))
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
      res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`})
    })
}

exports.getAll = function (req, res) {
  JsonAdDataLayer.findAllUsingQuery({userId: req.user.userId})
    .then(response => {
      res.status(200).json({status: 'success', payload: response})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
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
          res.status(200).json({status: 'success', payload: response})
        })
        .catch(err => {
          res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
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
          res.status(200).json({status: 'success', payload: response})
        })
        .catch(err => {
          res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.getJsonAdResponse = function (req, res) {
  jsonAdMessagesDataLayer.findOneUsingQuery({_id: req.params.id})
    .then(jsonAdMessage => {
      res.status(200).json({status: 'success', payload: jsonAdMessage})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.deleteOne = function (req, res) {
  JsonAdDataLayer.deleteOneUsingQuery({_id: req.params.id})
    .then(deletedAd => {
      jsonAdMessagesDataLayer.deleteUsingQuery({jsonAdId: req.params.id})
        .then(deletedMessages => {
          res.status(200).json({status: 'success'})
        })
        .catch(err => {
          res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
exports.query = function (req, res) {
  JsonAdDataLayer.findAllUsingQuery(req.body)
    .then(response => {
      res.status(200).json({status: 'success', payload: response})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

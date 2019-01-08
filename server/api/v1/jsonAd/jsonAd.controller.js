const logger = require('../../../components/logger')
const JsonPostbackPayloadDataLayer = require('./jsonPostbackPayload.datalayer')
const JsonAdDataLayer = require('./jsonAd.datalayer')
const TAG = '/api/v1/menu/menu.controller.js'


exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create json ad endpoint')
  let messages = req.body.messageContent
  let requests = []
  requests.push(new Promise((resolve, reject) => {

  console.log('creating json ad')
        JsonAdDataLayer.create({
            pageId: req.body.pageId,
            companyId: req.body.companyId,
            userId: req.body.userId,
            messageContent: messages
        })
        .then(response => {
            console.log('response', response)
            resolve(response)
        })
        .catch(err => {
            console.log('error', err)
            reject(err)
        })
    }))
  for (let i = 0; i < messages.length; i++) {
      let message = messages[i]
      console.log('message', message)
      let messageButtons = message.buttons
      for (let j = 0; j < messageButtons.length; j++) {
          let messageButton = messageButtons[j]
          if (messageButton.type === 'postback') {
                requests.push(new Promise((resolve, reject) => {
                    JsonPostbackPayloadDataLayer.create({
                    postbackPayloadId: messageButton.payload,
                    responseMessage: message
                }).then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }))
        }
    }
  }
  Promise.all(requests)
  .then((responses) => res.status(200).json({status: 'success', payload: responses}))
  .catch((err) => res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`}))
}

exports.edit = function (req, res) {
    logger.serverLog(TAG, 'Hit the edit json ad endpoint')
    JsonAdDataLayer.update({_id: req.body.jsonMessageId}, {
        pageId: req.body.pageId,
        companyId: req.body.companyId,
        userId: req.body.userId,
        messageContent: req.body.messageContent
    })
    .then(response => {
        res.status(200).json({status: 'success', payload: response})
    })
    .catch(err => {
        res.status(500).json({status: 'failed', payload: err})
    })
}

exports.getAll = function (req, res) {
    JsonAdDataLayer.findAllUsingQuery({})
    .then(response => {
        res.status(200).json({status: 'success', payload: response})
    })
    .catch(err => {
        res.status(500).json({status: 'failed', payload: err})
    })
}

exports.getOne = function (req, res) {
    JsonAdDataLayer.findOneUsingQuery({_id: req.params.id})
    .then(response => {
        res.status(200).json({status: 'success', payload: response})
    })
    .catch(err => {
        res.status(500).json({status: 'failed', payload: err})
    })
}

exports.deleteOne = function (req, res) {
    JsonAdDataLayer.deleteOneUsingQuery({_id: req.params.id})
    .then(response => {
        res.status(200).json({status: 'success', payload: response})
    })
    .catch(err => {
        res.status(500).json({status: 'failed', payload: err})
    })
}
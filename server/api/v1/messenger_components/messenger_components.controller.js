const dataLayer = require('./messenger_components.datalayer')
const logicLayer = require('./messenger_components.logiclayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const TAG = '/api/v1/whatsAppContacts/whatsAppContacts.controller.js'
const logger = require('../../../components/logger')

exports.create = function (req, res) {
  dataLayer.createComponentObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create Whatsapp Contact'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  dataLayer.findComponentsObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch Whatsapp Contacts'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  let query = logicLayer.validateAndConvert(req.body)
  dataLayer.aggregateInfo(query)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate Whatsapp Contacts'
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdate(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update Whatsapp Contacts'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.deleteMany = function (req, res) {
  dataLayer.deleteMany(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Whatsapp Contacts'
      logger.serverLog(message, `${TAG}: exports.deleteMany`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

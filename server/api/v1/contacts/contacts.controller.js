const logger = require('../../../components/logger')
const dataLayer = require('./contacts.datalayer')
const logicLayer = require('./contacts.logiclayer')
const TAG = '/api/v1/subscribers/subscribers.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create subscriber controller index', req.body)
  dataLayer.createContactObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create contact'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for subscriber controller')

  dataLayer.findContactObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch contact'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {}, 'error')
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
      const message = err || 'Failed to aggregate contact'
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdate(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to genericUpdate contact'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

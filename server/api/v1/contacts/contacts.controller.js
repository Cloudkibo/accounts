const logger = require('../../../components/logger')
const dataLayer = require('./contacts.datalayer')
const logicLayer = require('./contacts.logiclayer')
const TAG = '/api/v1/subscribers/subscribers.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  dataLayer.createContactObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create contact'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  dataLayer.findContactObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch contact'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
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
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdate(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to genericUpdate contact'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

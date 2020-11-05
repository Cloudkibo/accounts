const dataLayer = require('./integrationUsage.datalayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const TAG = '/api/v1/integerationUsage/integerationUsage.controller.js'
const logger = require('../../../components/logger')

exports.create = function (req, res) {
  dataLayer.createIntegrationUsageObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create Integrations Usage'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  dataLayer.findIntegrationUsageObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch Integrations Usage'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdate(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update Integrations Usage'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.delete = function (req, res) {
  dataLayer.deleteIntegrationUsageObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Integrations Usage'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

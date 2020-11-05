const dataLayer = require('./integrations.datalayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const TAG = '/api/v1/integeration/integeration.controller.js'
const logger = require('../../../components/logger')

exports.create = function (req, res) {
  dataLayer.createIntegrationObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to createIntegration'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  dataLayer.findIntegrationObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to find All Integrations'
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
      const message = err || 'Failed to update Integrations'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.delete = function (req, res) {
  dataLayer.deleteIntegrationObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Integrations'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

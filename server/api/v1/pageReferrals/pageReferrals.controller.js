const logger = require('../../../components/logger')
const dataLayer = require('./pageReferrals.datalayer')
const TAG = '/api/v1/pageReferrals/pageReferrals.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create pageReferrals controller', req.body)
  dataLayer.createPageReferral(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create PageReferral '
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for pageReferrals')
  dataLayer.findPageReferrals(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Find PageReferral '
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update PageReferral endpoint')
  dataLayer.updatePageReferral(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update PageReferral '
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete pageReferrals')

  dataLayer.deletePageReferral(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete PageReferral '
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

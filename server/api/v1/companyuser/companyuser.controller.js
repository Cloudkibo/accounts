const logger = require('../../../components/logger')
const dataLayer = require('./companyuser.datalayer')
const TAG = '/api/v1/companyuser/companyuser.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.genericFetch = function (req, res) {
  dataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to find company User'
      logger.serverLog(message, `${TAG}: exports.genericFetch`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFetchAll = function (req, res) {
  dataLayer
    .findAllCompanyUserObjectUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to find All company User'
      logger.serverLog(message, `${TAG}: exports.genericFetchAll`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdatePostObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to find update company User'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

const logger = require('../../../components/logger')
const dataLayer = require('./companyuser.datalayer')
const TAG = '/api/v1/companyuser/companyuser.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.genericFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate(req.body)
    .then(result => {
      logger.serverLog(TAG, `query endpoint for c_user ${util.inspect(result)}`)
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFetchAll = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetchAll controller index')

  dataLayer
    .findAllCompanyUserObjectUsingQuery(req.body)
    .then(result => {
      logger.serverLog(TAG, `query endpoint for c_user ${util.inspect(result)}`)
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePostObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

const logger = require('../../../components/logger')
const logicLayer = require('./usage.logiclayer')
const dataLayer = require('./usage.datalayer')
const TAG = '/api/v1/featureusuage/featureusuage.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find usage controller index')

  dataLayer.findOnePlanUsage(req.params.id)
    .then(usage => {
      sendSuccessResponse(res, 200, usage)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.createPlanUsage = function (req, res) {
  logger.serverLog(TAG, 'Hit the create usage controller index')
  dataLayer.createPlanUsage(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, 'Usage item has been added successfully!')
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.createCompanyUsage = function (req, res) {
  logger.serverLog(TAG, 'Hit the create usage controller index')
  dataLayer.createCompanyUsage(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, 'Usage item has been added successfully!')
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update usage controller index')

  dataLayer.updateUsage(req.params.id, logicLayer.prepareUpdateUsagePayload(req.body))
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}
exports.populatePlanUsage = function (req, res) {
  dataLayer.populatePlan(req, res)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.fetchGeneralPlanUsage = function (req, res) {
  logger.serverLog(TAG, 'fetchGeneralPlanUsage query endpoint')

  dataLayer.findAllPlanUsageObjects(req.body)
    .then(users => {
      sendSuccessResponse(res, 200, users)
    })
    .catch(err => {
      logger.serverLog(TAG, `fetch general endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.fetchGeneralCompanyUsage = function (req, res) {
  logger.serverLog(TAG, 'fetchGeneralCompanyUsage query endpoint')

  dataLayer.findAllCompanyUsageObjects(req.body)
    .then(users => {
      sendSuccessResponse(res, 200, users)
    })
    .catch(err => {
      logger.serverLog(TAG, `fetch general endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdateCompany = function (req, res) {
  logger.serverLog(TAG, 'generic company update endpoint')

  dataLayer.genericUpdateCUsageObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(result)}`)
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.populateCompanyUsage = function (req, res) {
  dataLayer.populateCompany(req, res)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

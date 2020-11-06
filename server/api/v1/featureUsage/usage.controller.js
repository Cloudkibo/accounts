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
      const message = err || 'Failed to find PlanUsage'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {}, 'error') 
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
      const message = err || 'Failed to create PlanUsage'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error') 
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
      const message = err || 'Failed to create companyUsage'
      logger.serverLog(message, `${TAG}: exports.createCompanyUsage`, req.body, {}, 'error') 
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
      const message = err || 'Failed to update PlanUsage'
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {}, 'error') 
      sendErrorResponse(res, 500, err)
    })
}
exports.populatePlanUsage = function (req, res) {
  dataLayer.populatePlan(req, res)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to populate PlanUsage'
      logger.serverLog(message, `${TAG}: exports.populatePlanUsage`, req.body, {}, 'error')
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
      const message = err || 'Failed to fetch All plan Usage'
      logger.serverLog(message, `${TAG}: exports.fetchGeneralPlanUsage`, req.body, {}, 'error') 
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
      const message = err || 'Failed to fetch All company Usage'
      logger.serverLog(message, `${TAG}: exports.fetchGeneralCompanyUsage`, req.body, {}, 'error') 
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
      const message = err || 'Failed to update company Usage'
      logger.serverLog(message, `${TAG}: exports.genericUpdateCompany`, req.body, {}, 'error') 
      sendErrorResponse(res, 500, err)
    })
}

exports.populateCompanyUsage = function (req, res) {
  dataLayer.populateCompany(req, res)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to populate company Usage'
      logger.serverLog(message, `${TAG}: exports.populateCompanyUsage`, req.body, {}, 'error') 
      sendErrorResponse(res, 500, err)
    })
}

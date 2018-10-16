const logger = require('../../../components/logger')
const logicLayer = require('./usage.logiclayer')
const dataLayer = require('./usage.datalayer')
const TAG = '/api/v1/featureusuage/featureusuage.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find usage controller index')

  dataLayer.findOnePlanUsage(req.params.id)
    .then(usage => {
      return res.status(200).json({status: 'success', payload: usage})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}
exports.createPlanUsage = function (req, res) {
  logger.serverLog(TAG, 'Hit the create usage controller index')
  dataLayer.createPlanUsage(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: 'Usage item has been added successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}
exports.createCompanyUsage = function (req, res) {
  logger.serverLog(TAG, 'Hit the create usage controller index')
  dataLayer.createCompanyUsage(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: 'Usage item has been added successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}
exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update usage controller index')

  dataLayer.updateUsage(req.params.id, logicLayer.prepareUpdateUsagePayload(req.body))
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}
exports.populatePlanUsage = function (req, res) {
  dataLayer.populatePlan(req, res)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.fetchGeneralPlanUsage = function (req, res) {
  logger.serverLog(TAG, 'fetchGeneralPlanUsage query endpoint')

  dataLayer.findAllPlanUsageObjects(req.body)
    .then(users => {
      return res.status(200).json({status: 'success', payload: users})
    })
    .catch(err => {
      logger.serverLog(TAG, `fetch general endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.fetchGeneralCompanyUsage = function (req, res) {
  logger.serverLog(TAG, 'fetchGeneralCompanyUsage query endpoint')

  dataLayer.findAllCompanyUsageObjects(req.body)
    .then(users => {
      return res.status(200).json({status: 'success', payload: users})
    })
    .catch(err => {
      logger.serverLog(TAG, `fetch general endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericUpdateCompany = function (req, res) {
  logger.serverLog(TAG, 'generic company update endpoint')

  dataLayer.genericUpdateCUsageObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.populateCompanyUsage = function (req, res) {
  dataLayer.populateCompany(req, res)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

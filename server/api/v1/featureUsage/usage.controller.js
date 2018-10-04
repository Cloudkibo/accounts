const logger = require('../../../components/logger')
const logicLayer = require('./comment_capture.logiclayer')
const dataLayer = require('./comment_capture.datalayer')
const TAG = '/api/v1/comment_capture/comment_capture.controller.js'

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

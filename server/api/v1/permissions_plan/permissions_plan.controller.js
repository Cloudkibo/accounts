const logger = require('../../../components/logger')
const logicLayer = require('./permissions_plan.logiclayer')
const dataLayer = require('./permissions_plan.datalayer')
const TAG = '/api/v1/permissions_plan/permissions_plan.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find permissionPlan controller index')

  dataLayer.findOnePermissionsPlanObject(req.params._id)
    .then(permissionPlanObject => {
      res.status(200).json({status: 'success', payload: permissionPlanObject})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create permissionPlan controller index')
  dataLayer.createPermissionsPlanObject(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update permissionPlan controller index')

  dataLayer.updatePermissionsPlanObject(req.params._id, req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update permissionPlan ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete permissionPlan controller index')

  dataLayer.deletePermissionsPlanObject(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete permissionPlan ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for permissionPlan controller')

  dataLayer.findPermissionsPlanObjects(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying permissionPlan ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for permissionPlan controller')

  dataLayer.aggregateInfo(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate permissionPlan ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

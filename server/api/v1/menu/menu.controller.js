const logger = require('../../../components/logger')
const logicLayer = require('./menu.logiclayer')
const dataLayer = require('./menu.datalayer')
const TAG = '/api/v1/menu/menu.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find menu controller index')

  dataLayer.findOneMenuObject(req.params._id)
    .then(menuObject => {
      sendSuccessResponse(res, 200, menuObject)
    })
    .catch(err => {
      const message = err || 'Failed to Fetch Menu'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create menu controller index')
  dataLayer.createMenuObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create Menu'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update menu controller index')

  dataLayer.updateMenuObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Update Menu'
      logger.serverLog(message, `${TAG}: exports.Update`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete menu controller index')

  dataLayer.deleteMenuObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Menu'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for menu controller')

  dataLayer.findMenuObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to find Menu'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for menu controller')

  dataLayer.aggregateInfo(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate Menu'
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdateMenuObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Update Menu'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

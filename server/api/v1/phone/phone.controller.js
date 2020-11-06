const logger = require('../../../components/logger')
const logicLayer = require('./phone.logiclayer')
const dataLayer = require('./phone.datalayer')
const TAG = '/api/v1/phone/phone.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find phone controller index')

  dataLayer.findOnePhoneObject(req.params._id)
    .then(phoneObject => {
      sendSuccessResponse(res, 200, phoneObject)
    })
    .catch(err => {
      const message = err || 'Failed to find Phone Number'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create phone controller index')
  dataLayer.createPhoneObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create Phone Number'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update phone controller index')

  dataLayer.updatePhoneObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update Phone Number'
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete phone controller index')

  dataLayer.deletePhoneObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Phone Number'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for phone controller')

  dataLayer.findPhoneObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Phone Number'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for phone controller')

  dataLayer.aggregateInfo(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate Phone Number'
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePhoneObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Update Phone Number'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

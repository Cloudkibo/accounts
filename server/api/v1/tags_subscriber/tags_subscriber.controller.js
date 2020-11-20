const datalayer = require('./tags_subscriber.datalayer')
const logiclayer = require('./tags_subscriber.logiclayer')
const util = require('util')
const logger = require('../../../components/logger')
const TAG = 'api/v1/tags_subscriber/tags_subscriber.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  datalayer.findAllTagSubObjectUsingQuery({})
    .then(tagsubs => {
      sendSuccessResponse(res, 200, tagsubs)
    })
    .catch(err => {
      const message = err || 'Failed to find AllTagSubObject'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.findOne = function (req, res) {
  let query = { _id: req.params.id ? req.params.id : '' }
  datalayer.findOneTagSubObjectUsingQuery(query)
    .then(tagsub => {
      // tag sub will be null if the given id is not found
      sendSuccessResponse(res, 200, tagsub)
    })
    .catch(err => {
      const message = err || 'Failed to find Tag Subcriber'
      logger.serverLog(message, `${TAG}: exports.findOne`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.create = function (req, res) {
  let payload = logiclayer.prepareCreatePayload(req.body)
  datalayer.createTagSubObject(payload)
    .then(tagsub => {
      sendSuccessResponse(res, 200, tagsub)
    })
    .catch(err => {
      const message = err || 'Failed to create Tag Subcriber'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.delete = function (req, res) {
  let query = { _id: req.params.id ? req.params.id : '' }
  datalayer.deleteOneTagSubObjectUsingQuery(query)
    .then(tagsub => {
      sendSuccessResponse(res, 200, tagsub)
    })
    .catch(err => {
      const message = err || 'Failed to delete Tag Subcriber'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.deleteMany = function (req, res) {
  let query = req.body ? req.body : ''
  datalayer.deleteTagSubObjectUsingQuery(query)
    .then(tagsub => {
      sendSuccessResponse(res, 200, tagsub)
    })
    .catch(err => {
      const message = err || 'Failed to deleteMany Tag Subcriber'
      logger.serverLog(message, `${TAG}: exports.deleteMany`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.query = function (req, res) {

  datalayer.findAllTagSubObjectUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to find Tag Subcriber'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.aggregate = function (req, res) {
  console.log('countCriteria', req.body)
  let query = logiclayer.validateAndConvert(req.body)
  datalayer.findTagSubObjectUsingAggregate(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate Tag Subcriber'
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.genericUpdate = function (req, res) {
  datalayer.genericUpdateTagSubObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update Tag Subcriber'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

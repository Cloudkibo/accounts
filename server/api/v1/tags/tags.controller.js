const datalayer = require('./tags.datalayer')
const logiclayer = require('./tags.logiclayer')
const util = require('util')
const logger = require('../../../components/logger')
const TAG = 'api/v1/tags/tags.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  datalayer.findAllTagObjectUsingQuery({})
    .then(tags => {
      sendSuccessResponse(res, 200, tags)
    })
    .catch(err => {
      const message = err || 'Failed to Fetch tags'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.findOne = function (req, res) {
  let query = { _id: req.params.id ? req.params.id : '' }
  datalayer.findOneTagObjectUsingQuery(query)
    .then(tag => {
      // tag sub will be null if the given id is not found
      sendSuccessResponse(res, 200, tag)
    })
    .catch(err => {
      const message = err || 'Failed to Fetch tag'
      logger.serverLog(message, `${TAG}: exports.findOne`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.create = function (req, res) {
  datalayer.createTagObject(req.body)
    .then(tag => {
      sendSuccessResponse(res, 200, tag)
    })
    .catch(err => {
      const message = err || 'Failed to create tag'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.delete = function (req, res) {
  let query = { _id: req.params.id ? req.params.id : '' }
  datalayer.deleteOneTagObjectUsingQuery(query)
    .then(tag => {
      sendSuccessResponse(res, 200, tag)
    })
    .catch(err => {
      const message = err || 'Failed to delete tag'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.deleteMany = function (req, res) {
  let query = req.body ? req.body : ''
  datalayer.deleteTagObjectUsingQuery(query)
    .then(tag => {
      sendSuccessResponse(res, 200, tag)
    })
    .catch(err => {
      const message = err || 'Failed to delete tags'
      logger.serverLog(message, `${TAG}: exports.deleteMany`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.query = function (req, res) {
  datalayer.findAllTagObjectUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch tags'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.aggregate = function (req, res) {
  let query = logiclayer.validateAndConvert(req.body)
  logger.serverLog(`after conversion query ${util.inspect(query)}`, TAG)
  datalayer.findTagObjectUsingAggregate(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate tags'
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

exports.genericUpdate = function (req, res) {
  datalayer.genericUpdateTagObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate tags'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, 'Internal Server Error')
    })
}

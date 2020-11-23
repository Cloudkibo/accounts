const dataLayer = require('./comments.datalayer')
const LogicLayer = require('./comments.logiclayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const TAG = '/api/v1/comment_capture/comments.controller.js'
const logger = require('../../../components/logger')

exports.create = function (req, res) {
  dataLayer.createCommentObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create record of comments'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  dataLayer.deleteCommentObjectUsingQuery(req.body)
    .then(deleted => {
      sendSuccessResponse(res, 200, deleted)
    })
    .catch(err => {
      const message = err || 'Failed to delete record of comments'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFetch = function (req, res) {
  dataLayer
    .findAllCommentsObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch comments'
      logger.serverLog(message, `${TAG}: exports.genericFetch`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateFetch = function (req, res) {
  dataLayer
    .findCommentObjectUsingAggregate(LogicLayer.validateAndConvert(req.body))
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate fetch comments'
      logger.serverLog(message, `${TAG}: exports.aggregateFetch`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdateCommentObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Update comments'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

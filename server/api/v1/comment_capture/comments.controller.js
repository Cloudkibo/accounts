const dataLayer = require('./comments.datalayer')
const LogicLayer = require('./comments.logiclayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  dataLayer.createCommentObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  dataLayer.deleteCommentObjectUsingQuery(req.body)
    .then(deleted => {
      sendSuccessResponse(res, 200, deleted)
    })
    .catch(err => {
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
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdateCommentObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

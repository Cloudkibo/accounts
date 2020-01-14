const dataLayer = require('./overlayWidgets.datalayer')
const logicLayer = require('./overlayWidgets.logiclayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  dataLayer.create(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  dataLayer.find(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdate(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.delete = function (req, res) {
  dataLayer.delete(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.aggregate = function (req, res) {
  let query = logicLayer.validateAndConvert(req.body)
  dataLayer.aggregate(query)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

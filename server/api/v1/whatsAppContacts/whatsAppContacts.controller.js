const dataLayer = require('./whatsAppContacts.datalayer')
const logicLayer = require('./whatsAppContacts.logiclayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  dataLayer.createContactObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.query = function (req, res) {
  dataLayer.findContactObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.aggregate = function (req, res) {
  let query = logicLayer.validateAndConvert(req.body)
  dataLayer.aggregateInfo(query)
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

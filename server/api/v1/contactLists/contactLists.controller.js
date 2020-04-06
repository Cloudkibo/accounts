// Web layer of this API node
const DataLayer = require('./contactLists.datalayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.create = function (req, res) {
  DataLayer.createContactList(req.body)
    .then(createdObject => {
      sendSuccessResponse(res, 200, createdObject)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  DataLayer.findContactListsUsingQuery(req.body)
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  DataLayer.updateContactList(req.body)
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  DataLayer.deleteContactList(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

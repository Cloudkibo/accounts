const logger = require('../../../components/logger')
const logicLayer = require('./lists.logiclayer')
const dataLayer = require('./lists.datalayer')
const TAG = '/api/v1/lists/lists.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find list controller index')

  dataLayer.findOneListObject(req.params._id)
    .then(listObject => {
      sendSuccessResponse(res, 200, listObject)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create list controller index')
  dataLayer.findListObjects({companyId: req.body.companyId, listName: req.body.listName})
    .then(data => {
      if (data.length === 0) {
        dataLayer.createListObject(
          req.body.listName, req.body.userId, req.body.companyId, req.body.content,
          req.body.conditions, req.body.initialList, req.body.parentList,
          req.body.parentListName,
          req.body.joiningCondition
        )
          .then(result => {
            sendSuccessResponse(res, 200, result)
          })
          .catch(err => {
            sendErrorResponse(res, 500, err)
          })
      } else {
        sendErrorResponse(res, 400, 'List is already created with this name Please choose another name')
      }
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update list controller index')
  dataLayer.updateListObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update list ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete list controller index')

  dataLayer.deleteListObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete list ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for list controller')

  dataLayer.findListObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying list ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for list controller')
  let query = logicLayer.validateAndConvert(req.body)

  dataLayer.aggregateInfo(query)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate list ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdateListObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

const logger = require('../../../components/logger')
const logicLayer = require('./lists.logiclayer')
const dataLayer = require('./lists.datalayer')
const TAG = '/api/v1/lists/lists.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {

  dataLayer.findOneListObject(req.params._id)
    .then(listObject => {
      sendSuccessResponse(res, 200, listObject)
    })
    .catch(err => {
      const message = err || 'Failed to Find List'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
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
            const message = err || 'Failed to create List'
            logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
            sendErrorResponse(res, 500, err)
          })
      } else {
        sendErrorResponse(res, 400, 'List is already created with this name Please choose another name')
      }
    })
    .catch(err => {
      const message = err || 'Failed to Find List'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  dataLayer.updateListObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update List'
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {

  dataLayer.deleteListObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete List'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  dataLayer.findListObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Fetch List'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
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
      const message = err || 'Failed to aggregate List'
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdateListObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Update List'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

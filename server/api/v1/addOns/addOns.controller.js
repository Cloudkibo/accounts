// Web layer of this API node
const logger = require('../../../components/logger')
const DataLayer = require('./addOns.datalayer')
const TAG = '/api/v1/addOns/addOns.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  DataLayer.findAllRecords()
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      const message = error || 'Failed to find addOns'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')      
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.create = function (req, res) {
  DataLayer.createOneRecord(req.body)
    .then(createdObject => {
      sendSuccessResponse(res, 200, createdObject)
    })
    .catch(err => {
      const message = error || 'Failed to create addOns'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')      
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.query = function (req, res) {
  DataLayer.findRecordsUsingQuery(req.body)
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      const message = error || 'Failed to find addOns'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')      
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.update = function (req, res) {
  DataLayer.updateRecords(req.body)
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      const message = error || 'Failed to update addOns'
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.delete = function (req, res) {
  DataLayer.deleteRecords(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = error || 'Failed to delete addOns'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {user: req.user}, 'error')
       sendErrorResponse(res, 500, err.toString())
    })
}

// Web layer of this API node
const logger = require('../../../components/logger')
const DataLayer = require('./custom_field_subscriber.datalayer')
const TAG = '/api/v1/kiboengage/custom_field_subscriber/custom_field_subscriber.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  DataLayer.findAllCustomFieldSubscriberObjects()
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      const message = err || 'Failed to findAll Custom Field Subscribers'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.create = function (req, res) {

  DataLayer.createOneCustomFieldSubscriberObject(req.body)
    .then(createdObject => {
      sendSuccessResponse(res, 200, createdObject)
    })
    .catch(err => {
      const message = err || 'Failed to create Custom Field Subscribers'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.query = function (req, res) {
  DataLayer.findCustomFieldubscriberUsingQuery(req.body)
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      const message = err || 'Failed to fetch Custom Field Subscribers'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.update = function (req, res) {

  DataLayer.updateCustomFieldSubscriber(req.body)
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      const message = err || 'Failed to update Custom Field Subscribers'
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.delete = function (req, res) {
  DataLayer.deleteCustomFieldSubscriber(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Custom Field Subscribers'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err.toString())
    })
}

// Web layer of this API node
const logger = require('../../../components/logger')
const DataLayer = require('./custom_field.datalayer')
const CUSTOMFIELD = '/api/v1/kiboengage/tags/custom_field.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')
const TAG = '/api/v1/kiboengage/custom_fields/custom_field.controller.js'

exports.index = function (req, res) {
  DataLayer.findAllCustomFieldObjects()
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      const message = err || 'Failed to findAll Custom Field'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')      
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.create = function (req, res) {
  let query = {
    purpose: 'findOne',
    match: {
      name: {$regex: `^${req.body.name}$`, $options: 'i'},
      $or: [{companyId: req.body.companyId}, {default: true}] 
    }
  }
  DataLayer.findCustomFieldsUsingQuery(query)
    .then(foundCustomFields => {
      if (foundCustomFields) {
        sendErrorResponse(res, 400, `${req.body.name} custom field already exists`)
      } else {
        DataLayer.createOneCustomFieldObject(req.body)
          .then(createdObject => {
            sendSuccessResponse(res, 200, createdObject)
          })
          .catch(err => {
            const message = err || 'Failed to create Custom Field'
            logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')    
            sendErrorResponse(res, 500, err.toString())
          })
      }
    })
    .catch(err => {
      const message = err || 'Failed to find Custom Field'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')    
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.query = function (req, res) {

  DataLayer.findCustomFieldsUsingQuery(req.body)
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      const message = err || 'Failed to find Custom Field'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')    
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.update = function (req, res) {
  let query = {
    purpose: 'findOne',
    match: {
      name: {$regex: `^${req.body.updated.name}$`, $options: 'i'},
      $or: [{companyId: req.body.updated.companyId}, {default: true}],
      _id: {$ne: req.body.match._id}
    }
  }
  DataLayer.findCustomFieldsUsingQuery(query)
    .then(foundCustomField => {
      if (foundCustomField) {
        sendErrorResponse(res, 400, `${req.body.updated.name} custom field already exists`)
      } else {
        DataLayer.updateCustomField(req.body)
          .then(foundObjects => {
            sendSuccessResponse(res, 200, foundObjects)
          })
          .catch(err => {
            const message = err || 'Failed to update Custom Field'
            logger.serverLog(message, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error') 
            sendErrorResponse(res, 500, err)
          })
      }
    })
    .catch(err => {
      const message = err || 'Failed to find Custom Field'
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error') 
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.delete = function (req, res) {
  DataLayer.deleteCustomField(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Custom Field'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {companyId: req.user.companyId, user: req.user}, 'error') 
      sendErrorResponse(res, 500, err.toString())
    })
}

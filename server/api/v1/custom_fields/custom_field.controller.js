// Web layer of this API node
const logger = require('../../../components/logger')
const DataLayer = require('./custom_field.datalayer')
const CUSTOMFIELD = '/api/v1/kiboengage/tags/custom_field.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Index endpoint is hit:`)
  DataLayer.findAllCustomFieldObjects()
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found Index Controller : ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.create = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Create endpoint is hit:`)
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
            logger.serverLog(CUSTOMFIELD, `Error found create Controller : ${util.inspect(err)}`)
            sendErrorResponse(res, 500, err.toString())
          })
      }
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found create Controller : ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.query = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Query endpoint is hit:`)

  DataLayer.findCustomFieldsUsingQuery(req.body)
    .then(foundObjects => {
      sendSuccessResponse(res, 200, foundObjects)
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found Query Controller : ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.update = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Update endpoint is hit:`)
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
            logger.serverLog(CUSTOMFIELD, `Error found Update Controller : ${util.inspect(err)}`)
            sendErrorResponse(res, 500, err)
          })
      }
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found update Controller : ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err.toString())
    })
}

exports.delete = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Delete endpoint is hit:`)
  DataLayer.deleteCustomField(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found Delete Controller : ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err.toString())
    })
}

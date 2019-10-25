const logger = require('../../../components/logger')
const logicLayer = require('./teams.logiclayer')
const dataLayer = require('./teams.datalayer')
const TAG = '/api/v1/test/index.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the fetch All teams')

  dataLayer
    .findAllTeamObjects()
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.findOne = function (req, res) {
  logger.serverLog(TAG, 'Hit the fetch One team')

  dataLayer
    .findOneTeamObject(req.params.id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create endpoint')
  dataLayer
    .saveTeamDocument(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the create team controller index')

  let payload = logicLayer.prepareUpdateUserPayload(req.body)
  if (Object.keys(payload).length > 0) {
    dataLayer.updateTeamObject(req.params.id, payload)
      .then(result => {
        sendSuccessResponse(res, 200, result)
      })
      .catch(err => {
        logger.serverLog(TAG, `Error at update user ${util.inspect(err)}`)
        sendErrorResponse(res, 500, err)
      })
  } else {
    logger.serverLog(TAG, `No field provided to update`)
    sendErrorResponse(res, 400, 'Provide field to update')
  }
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete team index')

  dataLayer.deleteTeamObject(req.params.id)
    .then(result => {
      sendErrorResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericTeamFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericTeamFetch controller index')
  dataLayer
    .findAllTeamObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateTeamFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregateTeamFetch controller index')
  dataLayer
    .findTeamObjectUsingAggregate(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdateTeamObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

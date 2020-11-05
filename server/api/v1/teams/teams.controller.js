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
      const message = err || 'Failed to fetch teams'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {}, 'error')
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
      const message = err || 'Failed to fetch team'
      logger.serverLog(message, `${TAG}: exports.findOne`, req.body, {}, 'error')
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
      const message = err || 'Failed to create team'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
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
        const message = err || 'Failed to update team'
        logger.serverLog(message, `${TAG}: exports.update`, req.body, {}, 'error')
        sendErrorResponse(res, 500, err)
      })
  } else {
    const message = 'No field provided to update'
    logger.serverLog(message, `${TAG}: exports.update`, req.body, {}, 'error')
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
      const message = err || 'Failed to delete team'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {}, 'error')
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
      const message = err || 'Failed to fetch teams'
      logger.serverLog(message, `${TAG}: exports.genericTeamFetch`, req.body, {}, 'error')
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
      const message = err || 'Failed to fetch aggregate teams'
      logger.serverLog(message, `${TAG}: exports.aggregateTeamFetch`, req.body, {}, 'error')
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
      const message = err || 'Failed to update teams'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

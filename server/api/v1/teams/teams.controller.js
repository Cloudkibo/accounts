const logger = require('../../../components/logger')
const logicLayer = require('./teams.logiclayer')
const dataLayer = require('./teams.datalayer')
const TAG = '/api/v1/test/index.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {

  dataLayer
    .findAllTeamObjects()
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch teams'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.findOne = function (req, res) {
  dataLayer
    .findOneTeamObject(req.params.id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch team'
      logger.serverLog(message, `${TAG}: exports.findOne`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  dataLayer
    .saveTeamDocument(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create team'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  let payload = logicLayer.prepareUpdateUserPayload(req.body)
  if (Object.keys(payload).length > 0) {
    dataLayer.updateTeamObject(req.params.id, payload)
      .then(result => {
        sendSuccessResponse(res, 200, result)
      })
      .catch(err => {
        const message = err || 'Failed to update team'
        logger.serverLog(message, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
        sendErrorResponse(res, 500, err)
      })
  } else {
    const message = 'No field provided to update'
    logger.serverLog(message, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
    sendErrorResponse(res, 400, 'Provide field to update')
  }
}

exports.delete = function (req, res) {

  dataLayer.deleteTeamObject(req.params.id)
    .then(result => {
      sendErrorResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete team'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericTeamFetch = function (req, res) {
  dataLayer
    .findAllTeamObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch teams'
      logger.serverLog(message, `${TAG}: exports.genericTeamFetch`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateTeamFetch = function (req, res) {
  dataLayer
    .findTeamObjectUsingAggregate(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch aggregate teams'
      logger.serverLog(message, `${TAG}: exports.aggregateTeamFetch`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdateTeamObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update teams'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

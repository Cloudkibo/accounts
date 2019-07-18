const logger = require('../../../components/logger')
const dataLayer = require('./teams.datalayer')
const TAG = '/api/v1/teams/team_agents.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the fetch All agents')

  dataLayer
    .findAllAgentObjects()
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create agent endpoint')

  dataLayer
    .saveAgentDocument(
      req.body.teamId,
      req.body.companyId,
      req.body.agentId)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}
exports.deleteAgent = function (req, res) {
  logger.serverLog(TAG, 'Hit the deleteAgent agent endpoint')
  dataLayer
    .deleteAgentObject(
      req.body.teamId,
      req.body.companyId,
      req.body.agentId)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete agent index')

  dataLayer.deleteTeamObject(
    req.body.teamId,
    req.body.companyId,
    req.body.agentId)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericAgentsFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericAgentsFetch controller index')

  dataLayer
    .findAllAgentObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.distinctAgentsFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the distinctAgentsFetch controller index')

  dataLayer
    .findAllAgentObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateAgentsFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregateAgentsFetch controller index')
  dataLayer
    .findAgentObjectUsingAggregate(req.body)
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

  dataLayer.genericUpdateAgentObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

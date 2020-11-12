const logger = require('../../../components/logger')
const dataLayer = require('./teams.datalayer')
const TAG = '/api/v1/teams/team_agents.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  dataLayer
    .findAllAgentObjects()
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch team Agents'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  dataLayer
    .saveAgentDocument(
      req.body.teamId,
      req.body.companyId,
      req.body.agentId)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create team'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
exports.deleteAgent = function (req, res) {
  dataLayer
    .deleteAgentObject(
      req.body.teamId,
      req.body.companyId,
      req.body.agentId)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Agent '
      logger.serverLog(message, `${TAG}: exports.deleteAgent`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  dataLayer.deleteTeamObject(
    req.body.teamId,
    req.body.companyId,
    req.body.agentId)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Team '
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericAgentsFetch = function (req, res) {
  dataLayer
    .findAllAgentObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch All agent '
      logger.serverLog(message, `${TAG}: exports.genericAgentsFetch`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.distinctAgentsFetch = function (req, res) {
  dataLayer
    .findAllAgentObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to distinct Fetch Agents '
      logger.serverLog(message, `${TAG}: exports.genericAgentsFetch`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateAgentsFetch = function (req, res) {
  dataLayer
    .findAgentObjectUsingAggregate(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate Fetch Agents'
      logger.serverLog(message, `${TAG}: exports.aggregateAgentsFetch`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdateAgentObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Update Agent'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

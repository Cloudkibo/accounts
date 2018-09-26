const logger = require('../../../components/logger')
const dataLayer = require('./teams.datalayer')
const TAG = '/api/v1/teams/team_agents.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the fetch All agents')

  dataLayer
    .findAllAgentObjects()
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
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
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete agent index')

  dataLayer.deleteTeamObject(
    req.body.teamId,
    req.body.companyId,
    req.body.agentId)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericAgentsFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericAgentsFetch controller index')

  dataLayer
    .findAllAgentObjectsUsingQuery(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregateAgentsFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregateAgentsFetch controller index')
  dataLayer
    .findAgentObjectUsingAggregate(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

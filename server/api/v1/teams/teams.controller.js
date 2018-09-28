const logger = require('../../../components/logger')
const logicLayer = require('./teams.logiclayer')
const dataLayer = require('./teams.datalayer')
const TAG = '/api/v1/test/index.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the fetch All teams')

  dataLayer
    .findAllTeamObjects()
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.findOne = function (req, res) {
  logger.serverLog(TAG, 'Hit the fetch One team')

  dataLayer
    .findOneTeamObject(req.params.id)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create endpoint')

  dataLayer
    .saveTeamDocument(
      req.body.name,
      req.body.decription,
      req.body.created_by,
      req.body.companyId,
      req.body.teamPages,
      req.body.teamPagesIds)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the create team controller index')

  let payload = logicLayer.prepareUpdateUserPayload(req.body)
  if (Object.keys(payload).length > 0) {
    dataLayer.updateTeamObject(req.params.id, payload)
      .then(result => {
        return res.status(200).json({status: 'success', payload: result})
      })
      .catch(err => {
        logger.serverLog(TAG, `Error at update user ${util.inspect(err)}`)
        return res.status(500).json({status: 'failed', payload: err})
      })
  } else {
    logger.serverLog(TAG, `No field provided to update`)
    return res.status(500).json({status: 'failed', payload: 'Provide field to update'})
  }
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete team index')

  dataLayer.deleteTeamObject(req.params.id)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericTeamFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericTeamFetch controller index')
  dataLayer
    .findAllTeamObjectsUsingQuery(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregateTeamFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregateTeamFetch controller index')
  dataLayer
    .findTeamObjectUsingAggregate(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

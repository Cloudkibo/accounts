const logger = require('../../../components/logger')
const dataLayer = require('./teams.datalayer')
const TAG = '/api/v1/teams/team_pages.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the fetch All team Pages')

  dataLayer
    .findAllTeamObjects()
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create page endpoint')

  dataLayer
    .saveTeamPageDocument(
      req.body.teamId,
      req.body.companyId,
      req.body.pageId)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete page index')

  dataLayer.deleteTeamObject(
    req.body.teamId,
    req.body.companyId,
    req.body.pageId)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericPagesFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericPagesFetch controller index')

  if (req.body.type === 'one') {
    dataLayer
      .findOneTeamPageObjectUsingQuery(req.body.query)
      .then(result => {
        return res.status(200).json({status: 'success', payload: result})
      })
      .catch(err => {
        logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
        return res.status(500).json({status: 'failed', payload: err})
      })
  } else if (req.body.type === 'many') {
    dataLayer
      .findAllTeamPageObjectsUsingQuery(req.body.query)
      .then(result => {
        return res.status(200).json({status: 'success', payload: result})
      })
      .catch(err => {
        logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
        return res.status(500).json({status: 'failed', payload: err})
      })
  } else {
    return res.status(400).json({status: 'failed', payload: 'Please Provide type as one or many'})
  }
}

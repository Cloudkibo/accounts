const logger = require('../../../components/logger')
const dataLayer = require('./teams.datalayer')
const TAG = '/api/v1/teams/team_pages.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the fetch All team Pages')

  dataLayer
    .findAllTeamObjects()
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch team'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
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
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create team Page'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete page index')

  dataLayer.deletePageObject(
    req.body.teamId,
    req.body.companyId,
    req.body.pageId)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete Page Team '
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericPagesFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericPagesFetch controller index')

  dataLayer
    .findAllTeamPageObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch All Team pages'
      logger.serverLog(message, `${TAG}: exports.genericPagesFetch`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.distinctPagesFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the distinctPagesFetch controller index')

  dataLayer
    .findDistinctPageObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch distinct Team pages'
      logger.serverLog(message, `${TAG}: exports.distinctPagesFetch`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregatePagesFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregatePagesFetch controller index')
  dataLayer
    .findTeamPageObjectUsingAggregate(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch aggregate Team pages'
      logger.serverLog(message, `${TAG}: exports.aggregatePagesFetch`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePageObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update Team pages'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

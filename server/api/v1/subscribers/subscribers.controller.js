const logger = require('../../../components/logger')
const logicLayer = require('./subscribers.logiclayer')
const dataLayer = require('./subscribers.datalayer')
const TAG = '/api/v1/subscribers/subscribers.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find subscriber controller index')

  dataLayer.findOneSubscriberObject(req.params._id)
    .then(subscriberObject => {
      res.status(200).json({status: 'success', payload: subscriberObject})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create subscriber controller index', req.body)
  dataLayer.createSubscriberObject(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update subscriber controller index')

  dataLayer.updateSubscriberObject(req.params._id, req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete subscriber controller index')

  dataLayer.deleteSubscriberObject(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete subscriber ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for subscriber controller')

  dataLayer.findSubscriberObjects(req.body)
    .then(result => {
      logger.serverLog(TAG, `query endpoint for subscriber found result ${util.inspect(result)}`)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying subscriber ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, `Hit the aggregate endpoint for subscriber controller: ${util.inspect(req.body)}`)
  let query = logicLayer.validateAndConvert(req.body)
  logger.serverLog(TAG, `after conversion query ${util.inspect(query)}`)
  logger.serverLog(TAG, `after conversion query ${util.inspect(query[0].$match.datetime)}`)
  logger.serverLog(TAG, `after conversion query ${util.inspect(query[0].$match.pageId)}`)
  dataLayer.aggregateInfo(query)
    .then(result => {
      logger.serverLog(TAG, `aggregate endpoint for subscriber found result ${util.inspect(result)}`)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate subscriber ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdateSubscriberObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

const logger = require('../../../components/logger')
const logicLayer = require('./subscribers.logiclayer')
const dataLayer = require('./subscribers.datalayer')
const TAG = '/api/v1/subscribers/subscribers.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find subscriber controller index')

  dataLayer.findOnePageObject(req.params._id)
    .then(subscriberObject => {
      res.status(200).json({status: 'success', payload: subscriberObject})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create subscriber controller index')
  dataLayer.createSubscriberObject(
    req.body.pageScopedId, req.body.firstName, req.body.lastName, req.body.locale, req.body.timezone,
    req.body.email, req.body.gender, req.body.senderId, req.body.profilePic, req.body.coverPhoto, req.body.pageId, req.body.phoneNumber,
    req.body.unSubscribedBy, req.body.source, req.body.companyId, req.body.isSubscribed, req.body.isEnabledByPage
  )
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
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying subscriber ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for subscriber controller')

  dataLayer.aggregateInfo(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate subscriber ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

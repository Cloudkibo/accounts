const logger = require('../../../components/logger')
const logicLayer = require('./phone.logiclayer')
const dataLayer = require('./phone.datalayer')
const TAG = '/api/v1/phone/phone.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find phone controller index')

  dataLayer.findOnePhoneObject(req.params._id)
    .then(phoneObject => {
      res.status(200).json({status: 'success', payload: phoneObject})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create phone controller index')
  dataLayer.createPhoneObject(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update phone controller index')

  dataLayer.updatePhoneObject(req.params._id, req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update phone ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete phone controller index')

  dataLayer.deletePhoneObject(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete phone ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for phone controller')

  dataLayer.findPhoneObjects(req.body)
    .then(result => {
      console.log('Phone Objects', result)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying phone ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for phone controller')

  dataLayer.aggregateInfo(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate phone ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePhoneObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

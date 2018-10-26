const datalayer = require('./tags.datalayer')
const logiclayer = require('./tags.logiclayer')
const util = require('util')
const logger = require('../../../components/logger')
const TAG = 'api/v1/tags/tags.controller.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the index point')

  datalayer.findAllTagObjectUsingQuery({})
    .then(tags => {
      logger.serverLog(TAG, `Found tags: ${util.inspect(tags)}`)
      res.status(200).json({status: 'success', payload: tags})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at index endpoint: ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', description: 'Internal Server Error'})
    })
}

exports.findOne = function (req, res) {
  logger.serverLog(TAG, 'Hit the findOne point')
  let query = { _id: req.params.id ? req.params.id : '' }
  datalayer.findOneTagObjectUsingQuery(query)
    .then(tag => {
      // tag sub will be null if the given id is not found
      logger.serverLog(TAG, `Found tag: ${util.inspect(tag)}`)
      res.status(200).json({status: 'success', payload: tag})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at findOne endpoint: ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', description: 'Internal Server Error'})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create point')
  let payload = logiclayer.prepareCreatePayload(req.body)
  datalayer.createTagObject(payload)
    .then(tag => {
      logger.serverLog(TAG, `created tag: ${util.inspect(tag)}`)
      res.status(200).json({status: 'success', payload: tag})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at create endpoint: ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', description: 'Internal Server Error'})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete point')
  let query = { _id: req.params.id ? req.params.id : '' }
  datalayer.deleteOneTagObjectUsingQuery(query)
    .then(tag => {
      logger.serverLog(TAG, `deleted tag: ${util.inspect(tag)}`)
      res.status(200).json({status: 'success', payload: tag})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete endpoint: ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', description: 'Internal Server Error'})
    })
}

exports.deleteMany = function (req, res) {
  logger.serverLog(TAG, 'Hit the deleteMany point')
  let query = req.body ? req.body : ''
  datalayer.deleteTagObjectUsingQuery(query)
    .then(tag => {
      logger.serverLog(TAG, `deleted tags: ${util.inspect(tag)}`)
      res.status(200).json({status: 'success', payload: tag})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete many endpoint: ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', description: 'Internal Server Error'})
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  datalayer.findAllTagObjectUsingQuery(req.body)
    .then(result => {
      logger.serverLog(TAG, `found tags: ${util.inspect(result)}`)
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')
  let query = logiclayer.validateAndConvert(req.body)
  logger.serverLog(TAG, `after conversion query ${util.inspect(query)}`)
  datalayer.findTagObjectUsingAggregate(req.body)
    .then(result => {
      logger.serverLog(TAG, `found tags: ${util.inspect(result)}`)
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  datalayer.genericUpdateTagObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      logger.serverLog(TAG, `updated tags: ${util.inspect(result)}`)
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

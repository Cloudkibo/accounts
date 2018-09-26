const logger = require('../../../components/logger')
const logicLayer = require('./lists.logiclayer')
const dataLayer = require('./lists.datalayer')
const TAG = '/api/v1/lists/lists.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find list controller index')

  dataLayer.findOneListObject(req.params._id)
    .then(listObject => {
      res.status(200).json({status: 'success', payload: listObject})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create list controller index')
  dataLayer.createListObject(
    req.body.listName, req.body.userId, req.body.companyId, req.body.content,
    req.body.conditions, req.body.initialList, req.body.parentList,
    req.body.parentListName
  )
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update list controller index')

  dataLayer.updateListObject(req.params._id, req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update list ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete list controller index')

  dataLayer.deleteListObject(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete list ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for list controller')

  dataLayer.findListObjects(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying list ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for list controller')

  dataLayer.aggregateInfo(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate list ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

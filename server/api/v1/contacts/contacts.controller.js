const logger = require('../../../components/logger')
const dataLayer = require('./contacts.datalayer')
const logicLayer = require('./contacts.logiclayer')
const TAG = '/api/v1/subscribers/subscribers.controller.js'

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create subscriber controller index', req.body)
  dataLayer.createContactObject(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for subscriber controller')

  dataLayer.findContactObjects(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
exports.aggregate = function (req, res) {
  let query = logicLayer.validateAndConvert(req.body)
  dataLayer.aggregateInfo(query)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

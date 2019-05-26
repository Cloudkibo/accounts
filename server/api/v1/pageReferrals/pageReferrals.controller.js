const logger = require('../../../components/logger')
const dataLayer = require('./pageReferrals.datalayer')
const TAG = '/api/v1/pageReferrals/pageReferrals.controller.js'

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create pageReferrals controller', req.body)
  dataLayer.createPageReferral(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for pageReferrals')
  dataLayer.findPageReferrals(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update PageReferral endpoint')
  dataLayer.updatePageReferral(req.params._id, req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete pageReferrals')

  dataLayer.deletePageReferral(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

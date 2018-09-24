const logger = require('../../../components/logger')
const dataLayer = require('./pages.datalayer')
const TAG = '/api/v1/pages/pages.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find page controller index')

  dataLayer.findOnePageObject(id)
    .then(pageObject => {
      res.status(200).json({status: 'success', payload: pageObject})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create page controller index')
  dataLayer.createPageObject(
    req.body.pageId, req.body.pageName, req.body.pageUserName, req.body.pagePic, req.body.likes, req.body.accessToken,
    req.body.connected, req.body.userId, req.body.companyId, req.body.greetingText, req.body.welcomeMessage, req.body.isWelcomeMessageEnabled,
    req.body.gotPageSubscriptionPermission
  )
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update page controller index')

  dataLayer.updatePageObject(req.params._id, req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update page ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete page controller index')

  dataLayer.deletePageObject(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete page ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.connect = function (req, res) {
  logger.serverLog(TAG, 'Hit the connecting page controller index')

  dataLayer.updatePageObject(req.params._id, {connected: true})
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update page ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}


exports.disconnect = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete page controller index')

  dataLayer.updatePageObject(req.params._id, {connected: false})
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update page ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

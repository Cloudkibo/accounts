const logger = require('../../../components/logger')
const dataLayer = require('./pages.datalayer')
const logicLayer = require('./pages.logiclayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const TAG = '/api/v1/pages/pages.controller.js'
const needle = require('needle')

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find page controller index')

  dataLayer.findOnePageObject(req.params._id)
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

exports.getGreetingText = function (req, res) {
  dataLayer.findOnePageObject(req.params._id)
    .then(pageObject => {
      res.status(200).json({status: 'success', payload: pageObject.greetingText})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.setGreetingText = function (req, res) {
  logger.serverLog(TAG, 'Hit the setGreetingText page controller index')

  CompanyUserDataLayer.findOneCompanyUserObjectUsingQuery({domain_email: req.user.domain_email})
    .then(companyUser => {
      let query = {pageId: req.params._id, companyId: companyUser.companyId}
      let updated = req.body
      return dataLayer.updatePageObjectUsingQuery(query, updated, {multi: true})
    })
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at updated greetingText ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for page controller')

  dataLayer.findPageObjects(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying page ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for page controller')
  let query = logicLayer.validateAndConvert(req.body)

  dataLayer.aggregateInfo(query)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate page ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePageObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}
exports.whitelistDomain = function (req, res) {
  needle.get(`https://graph.facebook.com/v2.10/${req.body.page_id}?fields=access_token&access_token=${req.user.facebookInfo.fbToken}`,
    (err, resp) => {
      if (err) {
        console.log('error in getting page access toke', err)
      }
      let requesturl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${resp.body.access_token}`
      let whitelistDomains = {
        whitelisted_domains: req.body.whitelistDomains
      }
      needle.request('post', requesturl, whitelistDomains, {json: true}, function (err, resp) {
        if (err) {
          console.log('error in whitelisted_domains', err)
        }
        console.log('response from whitelisted_domains', resp.body)
        if (resp.body.result === 'success') {
          dataLayer.findAndUpdatePageObject({pageId: req.body.page_id, connected: true}, {whitelist_domains: req.body.whitelistDomains})
            .then(updated => {
              return res.status(200).json({status: 'success', payload: updated})
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: err})
            })
        } else {
          return res.status(500).json({status: 'failed', payload: resp.body})
        }
      })
    })
}

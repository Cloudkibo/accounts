const logger = require('../../../components/logger')
const dataLayer = require('./pages.datalayer')
const logicLayer = require('./pages.logiclayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const TAG = '/api/v1/pages/pages.controller.js'
const needle = require('needle')
const { callApi } = require('../../scripts/apiCaller')
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
  dataLayer.findOnePageObject(req.params._id)
    .then(page => {
      // create default tags
      callApi('tags/query', 'post', {purpose: 'findAll', match: {defaultTag: true, pageId: req.params._id, companyId: req.user.companyId}}, '', 'kiboengage')
        .then(defaultTags => {
          defaultTags = defaultTags.map((t) => t.tag)
          if (!defaultTags.includes(`_${page.pageId}_1`)) {
            createTag(req.user, page, `_${page.pageId}_1`)
          }
          if (!defaultTags.includes('male')) {
            createTag(req.user, page, 'male')
          }
          if (!defaultTags.includes('female')) {
            createTag(req.user, page, 'female')
          }
          if (!defaultTags.includes('other')) {
            createTag(req.user, page, 'other')
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at find default tags ${util.inspect(err)}`)
        })
      // initiate reach estimation
      needle('post', `https://graph.facebook.com/v2.11/me/broadcast_reach_estimations?access_token=${page.pageAccessToken}`)
        .then(reachEstimation => {
          if (reachEstimation.reach_estimation_id) {
            dataLayer.updatePageObject(req.params._id, {connected: true, reachEstimationId: reachEstimation.reach_estimation_id})
              .then(result => {
                res.status(200).json({status: 'success', payload: result})
              })
              .catch(err => {
                logger.serverLog(TAG, `Error at update page ${util.inspect(err)}`)
                res.status(500).json({status: 'failed', payload: err})
              })
          } else {
            logger.serverLog(TAG, `Failed to start reach estimation`)
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at find page ${util.inspect(err)}`)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at find page ${util.inspect(err)}`)
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

  CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
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
exports.fetchWhitelistedDomains = function (req, res) {
  if (req.user.facebookInfo && req.user.facebookInfo.fbToken) {
    needle.get(`https://graph.facebook.com/v2.10/${req.params._id}?fields=access_token&access_token=${req.user.facebookInfo.fbToken}`,
      (err, resp) => {
        if (err) {
          console.log('error in getting page access token', err)
          return res.status(200).json({status: 'failed', description: 'Error in getting accessToken'})
        }
        var accessToken = resp.body.access_token
        needle.get(`https://graph.facebook.com/v2.6/me/messenger_profile?fields=whitelisted_domains&access_token=${accessToken}`, function (err, resp) {
          if (err) {
            return res.status(200).json({status: 'failed', description: 'Error in getting whitelisted_domains'})
          }
          var whitelistDomains = []
          var body = JSON.parse(JSON.stringify(resp.body))
          if (body.data && body.data.length > 0 && body.data[0].whitelisted_domains) {
            whitelistDomains = body.data[0].whitelisted_domains
          }
          return res.status(200).json({status: 'success', payload: whitelistDomains})
        })
      })
  } else {
    return res.status(200).json({status: 'success', payload: []})
  }
}
exports.whitelistDomain = function (req, res) {
  needle.get(`https://graph.facebook.com/v2.10/${req.body.page_id}?fields=access_token&access_token=${req.user.facebookInfo.fbToken}`,
    (err, resp) => {
      if (err) {
        console.log('error in getting page access token', err)
      }
      var accessToken = resp.body.access_token
      needle.get(`https://graph.facebook.com/v2.6/me/messenger_profile?fields=whitelisted_domains&access_token=${accessToken}`, function (err, resp) {
        if (err) {
          console.log('error in whitelisted_domains', err)
        }
        var body = JSON.parse(JSON.stringify(resp.body))
        let temp = []
        if (body.data && body.data.length > 0 && body.data[0].whitelisted_domains) {
          temp = body.data[0].whitelisted_domains
        }
        for (var i = 0; i < req.body.whitelistDomains.length; i++) {
          temp.push(req.body.whitelistDomains[i])
        }
        let whitelistedDomains = {
          whitelisted_domains: temp
        }
        console.log('whitelistdomains', whitelistedDomains)
        let requesturl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${accessToken}`
        needle.request('post', requesturl, whitelistedDomains, {json: true}, function (err, resp) {
          if (err) {
            console.log('error in whitelisted_domains', err)
          }
          console.log('response from whitelisted_domains', resp.body)
          if (resp.body.result === 'success') {
            return res.status(200).json({status: 'success', payload: temp})
          } else {
            return res.status(500).json({status: 'failed', payload: resp.body})
          }
        })
      })
    })
}
exports.deleteWhitelistDomain = function (req, res) {
  needle.get(`https://graph.facebook.com/v2.10/${req.body.page_id}?fields=access_token&access_token=${req.user.facebookInfo.fbToken}`,
    (err, resp) => {
      if (err) {
        console.log('error in getting page access token', err)
      }
      var accessToken = resp.body.access_token
      needle.get(`https://graph.facebook.com/v2.6/me/messenger_profile?fields=whitelisted_domains&access_token=${accessToken}`, function (err, resp) {
        if (err) {
          console.log('error in whitelisted_domains', err)
        }
        var body = JSON.parse(JSON.stringify(resp.body))
        let temp = []
        if (body.data && body.data.length > 0 && body.data[0].whitelisted_domains) {
          let whitelistDomains = body.data[0].whitelisted_domains
          for (let i = 0; i < whitelistDomains.length; i++) {
            if (whitelistDomains[i] !== req.body.whitelistDomain) {
              temp.push(whitelistDomains[i])
            }
          }
          if (temp.length > 0 && temp.length === whitelistDomains.length) {
            return res.status(500).json({status: 'failed', description: 'Domain not found'})
          }
          let whitelistedDomains = {
            whitelisted_domains: temp
          }
          if (temp.length < 1) {
            let requesturl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${accessToken}`
            needle.request('delete', requesturl, {'fields': ['whitelisted_domains']}, {json: true}, function (err, resp) {
              if (err) {
                console.log(`Unable to delete whitelist domains ${util.inspect(err)}`)
              }
              var response = JSON.parse(JSON.stringify(resp.body))
              if (response.result === 'success') {
                return res.status(200).json({status: 'success', payload: temp})
              } else {
                return res.status(200).json({status: 'failed', description: `Unable to delete whitelist domain ${response}`})
              }
            })
          } else {
            let requesturl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${accessToken}`
            needle.request('post', requesturl, whitelistedDomains, {json: true}, function (err, resp) {
              if (err) {
                console.log(`Unable to delete whitelist domains ${err}`)
              }
              if (resp.body.result === 'success') {
                console.log(`Response Body ${resp.body}`)
                console.log(`Domains Left ${temp}`)
                return res.status(200).json({status: 'success', payload: temp})
              }
            })
          }
        } else {
          return res.status(500).json({status: 'success', payload: temp})
        }
      })
    })
}

function createTag (user, page, tag) {
  needle('post', `https://graph.facebook.com/v2.11/me/custom_labels?accessToken=${page.pageAccessToken}`)
    .then(label => {
      if (label.id) {
        let tagData = {
          tag: tag,
          userId: user._id,
          companyId: user.companyId,
          pageId: page._id,
          labelFbId: label.id
        }
        callApi('tags', 'post', tagData, '', 'kiboengage')
          .then(created => {
            logger.serverLog(TAG, `default tag created successfully!`)
          })
          .catch(err => {
            logger.serverLog(TAG, `Error at save tag ${util.inspect(err)}`)
          })
      } else {
        logger.serverLog(TAG, `Error at create tag on Facebook ${util.inspect(label.error)}`)
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at create tag on Facebook ${util.inspect(err)}`)
    })
}

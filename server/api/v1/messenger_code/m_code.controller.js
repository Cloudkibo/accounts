const logger = require('../../../components/logger')
const logicLayer = require('./m_code.logiclayer')
const analyticsDataLayer = require('./m_code.datalayer')
const pageDataLayer = require('./../pages/pages.datalayer')
const TAG = '/api/v1/menu/menu.controller.js'

const rp = require('request-promise')
const util = require('util')

exports.createCode = function (req, res) {
  logger.serverLog(TAG, 'Hit the create Code controller index')
  let currentPage
  let facebookResponse

  // Fetch the targeted page
  pageDataLayer.findOnePageObjectUsingQuery({pageId: req.body.pageId, connected: true})
    .then(page => {
      // Check if page found
      if (page) {
        // Proceed with the facebook request
        // Prepare fb request payload
        currentPage = page
        let requestPayload = {
          type: 'standard',
          image_size: req.body.image_size
        }
        if (req.body.data) requestPayload.data = req.body.data

        // Prepare rp options
        let options = {
          method: 'POST',
          uri: `https://graph.facebook.com/v2.6/me/messenger_codes?access_token=${page.accessToken}`,
          body: requestPayload,
          json: true
        }
        // promise chaining
        return rp(options)
      } else {
        // Page not found --- null
        res.status(404).json({status: 'failed', payload: 'Page Not Found'})
      }
    })
    .then(responseFromFacebook => {
      facebookResponse = responseFromFacebook
      // Promised chained with rp
      return logicLayer.findCompanyFromUser(req.user)
    })
    .then(company => {
      // promise chained with company from user
      // Poppulate the analytics table
      let ref = req.body.data ? req.body.data.ref ? req.body.data.ref : null : null
      let payload = logicLayer.prepareAnalyticsPayload(currentPage, req.user, company, ref)
      analyticsDataLayer.createCodeAnalyticsObject(payload)
        .then(result => {
          res.status(200).json({status: 'success', payload: facebookResponse})
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at creating analytics payload ${util.inspect(err)}`)
          res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error found at finding page with pageId ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.handleWebhookNotification = function (req, res) {
  logger.serverLog(TAG, 'Hit the Handle Webhook Notification controller')

  let ref
  let subscriberId = req.body.sender.id
  let pageId = req.body.recipient.id

  if (req.body.referral) ref = req.body.referral.ref
  else if (req.body.postback) ref = req.body.postback.referral.ref

  analyticsDataLayer.findOneCodeAnalyticsObjects({ pageId: pageId, ref: ref })
    .then(analytics => {
      analytics.subscriberIds.push(subscriberId)
      analytics.opened = analytics.opened++
      return analyticsDataLayer.saveObject(analytics)
    })
    .then(result => {
      res.status(200).json({status: 'success'})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at updating analytics object ${util.inspect(err)}`)
      res.status(500).json({status: 'failed'})
    })
}

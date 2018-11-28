const logger = require('../../../components/logger')
const logicLayer = require('./m_code.logiclayer')
const analyticsDataLayer = require('./m_code.datalayer')
const pageDataLayer = require('./../pages/pages.datalayer')
const TAG = '/api/v1/menu/menu.controller.js'

const rp = require('request-promise')
const util = require('util')

exports.createCode = function (req, res) {
  logger.serverLog(TAG, 'Hit the create Code controller index')

  // Fetch the targeted page
  pageDataLayer.findOnePageObjectUsingQuery({pageId: req.body.pageId, connected: true})
    .then(page => {
      // Check if page found
      if (page) {
        // Proceed with the facebook request
        // Prepare fb request payload
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
      // Promised chained with rp
      // Poppulate the analytics table
      res.status(200).json({status: 'success', payload: responseFromFacebook})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error found at finding page with pageId ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.handleWebhookNotification = function (req, res) {
  logger.serverLog(TAG, 'Hit the Handle Webhook Notification controller')
}

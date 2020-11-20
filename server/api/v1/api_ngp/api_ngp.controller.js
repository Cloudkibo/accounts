/**
 * Created by sojharo on 24/11/2017.
 */

// eslint-disable-next-line no-unused-vars
const logger = require('../../../components/logger')
// eslint-disable-next-line no-unused-vars
const TAG = '/api/v1/api_settings/index.js'

const dataLayer = require('./api_ngp.datalayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.query = function (req, res) {
  dataLayer.findOneApiObject({company_id: req.body.company_id})
    .then(settings => {
      if (!settings) {
       // sendErrorResponse(res, 500, '', 'API settings not initialized or invalid user. Call enable API to initialize them.')
        dataLayer.save_ngp({company_id: req.body.company_id, enabled: true, app_id: 'My NGP App Id', app_secret: 'My NGP Secret Key'})
          .then(savedSettings => {
            sendSuccessResponse(res, 200, savedSettings)
          })
          .catch(error => {
            const message = error || 'Failed to Save NGP'
            logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')      
            sendErrorResponse(res, 500, '', `Unable to save${error}`)
          })
      } else {
        sendSuccessResponse(res, 200, settings)
      }
    })
    .catch(err => {
      const message = err || 'Failed to Fetch setting'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error') 
      sendErrorResponse(res, 500, '', 'API query failed')
    })
}

exports.enable = function (req, res) {
  if (!req.body.settings) {
    dataLayer.save_ngp({company_id: req.body.company_id, enabled: true, app_id: 'My NGP App Id', app_secret: 'My NGP Secret Key'})
      .then(savedSettings => {
        sendSuccessResponse(res, 200, savedSettings)
      })
      .catch(error => {
        const message = error || 'Failed to Enable NGP'
        logger.serverLog(message, `${TAG}: exports.enable`, req.body, {user: req.user}, 'error')  
        sendErrorResponse(res, 500, '', `Unable to save${error}`)
      })
  } else {
    dataLayer.update_ngp({_id: req.body.settings._id}, {enabled: req.body.settings.enabled})
      .then(savedSettings => {
        sendSuccessResponse(res, 200, savedSettings)
      })
      .catch(error => {
        const message = error || 'Failed to Update NGP'
        logger.serverLog(message, `${TAG}: exports.enable`, req.body, {user: req.user}, 'error')  
        sendErrorResponse(res, 500, '', `Unable to save${error}`)
      })
  }
}

exports.save = function (req, res) {
  dataLayer.update_ngp({_id: req.body.settings._id}, {app_id: req.body.settings.app_id, app_secret: req.body.settings.app_secret})
    .then(savedSettings => {
      sendSuccessResponse(res, 200, req.body.settings)
    })
    .catch(error => {
      const message = error || 'Failed to save NGP'
      logger.serverLog(message, `${TAG}: exports.save`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, '', `Unable to save${error}`)
    })
}

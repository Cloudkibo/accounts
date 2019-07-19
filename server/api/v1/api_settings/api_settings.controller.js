const logger = require('../../../components/logger')
const logicLayer = require('./api_settings.logiclayer')
const dataLayer = require('./api_settings.datalayer')
const TAG = '/api/v1/api_settings/index.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const crypto = require('crypto')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the test index')
  dataLayer.findOneApiObject({company_id: req.body.company_id})
    .then(settings => {
      if (!settings) {
        logger.serverLog(TAG, `Did not found api settings: ${settings}`)
        sendErrorResponse(res, 500, '', 'API settings not initialized or invalid user. Call enable API to initialize them.')
      }
      sendSuccessResponse(res, 200, settings)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at index: ${err}`)
      sendErrorResponse(res, 500, '', 'API query failed')
    })
}

exports.enable = function (req, res) {
  logger.serverLog(TAG, 'Hit the enable index')

  dataLayer.findOneApiObject({company_id: req.body.company_id})
    .then(settings => {
      if (!settings) {
        let payload = logicLayer.getSettingsPayload(req.body.company_id)
        dataLayer.createApiObject(payload)
          .then(savedSettings => {
            sendSuccessResponse(res, 200, savedSettings)
          })
          .catch(err => {
            logger.serverLog(TAG, `Error at enable: ${err}`)
            sendErrorResponse(res, 500, '', 'API query failed')
          })
      } else {
        dataLayer.UpdateOneApiObject({_id: settings._id}, {enabled: true}, {new: true})
          .then(savedSettings => {
            sendSuccessResponse(res, 200, savedSettings)
          })
          .catch(err => {
            logger.serverLog(TAG, `Error at enable: ${err}`)
            sendErrorResponse(res, 500, '', 'API query failed')
          })
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at enable: ${err}`)
      sendErrorResponse(res, 500, '', 'API query failed')
    })
}

exports.disable = function (req, res) {
  logger.serverLog(TAG, 'Hit the disable index')

  dataLayer.findOneApiObject({company_id: req.body.company_id})
    .then(settings => {
      if (!settings) {
        sendErrorResponse(res, 500, '', 'API settings not initialized. Call enable API to initialize them.')
      }
      dataLayer.UpdateOneApiObject({_id: settings._id}, {enabled: false}, {new: true})
        .then(savedSettings => {
          sendSuccessResponse(res, 200, savedSettings)
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at enable: ${err}`)
          sendErrorResponse(res, 500, '', 'API query failed')
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at enable: ${err}`)
      sendErrorResponse(res, 500, '', 'API query failed')
    })
}

exports.reset = function (req, res) {
  logger.serverLog(TAG, 'Hit the reset index', req.body)
  dataLayer.findOneApiObject({company_id: req.body.company_id})
    .then(settings => {
      if (!settings) {
        logger.serverLog(TAG, `Did not found api settings: ${settings}`)
        sendErrorResponse(res, 500, '', 'API settings not initialized or invalid user. Call enable API to initialize them.')
      }
      let uid = crypto.randomBytes(10).toString('hex')
      let pwd = crypto.randomBytes(18).toString('hex')
      return dataLayer.UpdateOneApiObject({_id: settings._id}, {app_id: uid, app_secret: pwd}, {new: true})
    })
    .then(updatedSettings => {
      sendSuccessResponse(res, 200, updatedSettings)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at index: ${err}`)
      sendErrorResponse(res, 500, '', 'API query failed')
    })
}
exports.genericFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findOneApiObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${err}`)
      sendErrorResponse(res, 500, '', 'API query failed')
    })
}

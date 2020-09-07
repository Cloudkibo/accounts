const logger = require('../../../components/logger')
const dataLayer = require('./companyPreferences.datalayer')
const CompanyProfileDataLayer = require('./../companyprofile/companyprofile.datalayer')
const TAG = '/api/v1/companyPreferences/companyPreferences.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')
const async = require('async')


exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find controller index')
    dataLayer
      .findOneCompanyPreferencesUsingQuery({companyId: req.user.companyId})
      .then(companyPreference => {
        sendSuccessResponse(res, 200, companyPreference)
      })
      .catch(err => {
        sendErrorResponse(res, 500, err)
      })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create controller')
  var payload = {
    companyId: req.body.companyId, 
    unresolveSessionAlert: req.body.unresolveSessionAlert, 
    pendingSessionAlert: req.body.pendingSessionAlert
  }
    dataLayer
      .createCompanyPreferencesObject(payload)
      .then(companyPreference => {
        sendSuccessResponse(res, 200, companyPreference)
      })
      .catch(err => {
        sendErrorResponse(res, 500, err)
      })
}

exports.genericFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findAllCompanyPreferencesUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}


exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdateCompanyPreferencesObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

function updateCompanyPreferences (company, callback) {
  var payload = {
    companyId: company._id,
    unresolveSessionAlert: {
      "enabled": false,
      "notification_interval": 30,
      "interval_unit": "mins",
      "assignedMembers": "buyer"
    }, 
    pendingSessionAlert: {
      "enabled": false,
      "notification_interval": 5,
      "interval_unit": "mins",
      "assignedMembers": "buyer"
    }
  }
  dataLayer.createCompanyPreferencesObject(payload)
    .then(result => {
      callback()
    })
    .catch(err => {
      callback(err)
    })
}

exports.populate = function (req, res) {
  logger.serverLog(TAG, 'populate endpoint')

  CompanyProfileDataLayer.findAllProfileObjectsUsingQuery({})
    .then(companies => {
      async.each(companies, updateCompanyPreferences, function (err) {
        if (err) {
          res.status(500).json({status: 'failed', payload: err})
        } else {
          res.status(200).json({status: 'success', payload: 'updated successfully'})
        }
      })
    })
    .catch(err => {
      logger.serverLog(TAG, `populate company preferences endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}
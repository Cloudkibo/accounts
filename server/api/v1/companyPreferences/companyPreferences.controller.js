const logger = require('../../../components/logger')
const dataLayer = require('./companyPreferences.datalayer')
const CompanyProfileDataLayer = require('./../companyprofile/companyprofile.datalayer')
const TAG = '/api/v1/companyPreferences/companyPreferences.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')
const async = require('async')


exports.index = function (req, res) {
    dataLayer
      .findOneCompanyPreferencesUsingQuery({companyId: req.user.companyId})
      .then(companyPreference => {
        sendSuccessResponse(res, 200, companyPreference)
      })
      .catch(err => {
        const message = err || 'Failed to fetch CompanyPreferences'
        logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
        sendErrorResponse(res, 500, err)
      })
}

exports.create = function (req, res) {
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
        const message = err || 'Failed to create CompanyPreferences'
        logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
        sendErrorResponse(res, 500, err)
      })
}

exports.genericFetch = function (req, res) {

  dataLayer
    .findAllCompanyPreferencesUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to find All CompanyPreferences'
      logger.serverLog(message, `${TAG}: exports.genericFetch`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}


exports.genericUpdate = function (req, res) {

  dataLayer.genericUpdateCompanyPreferencesObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch CompanyPreferences'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
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
  CompanyProfileDataLayer.findAllProfileObjectsUsingQuery({})
    .then(companies => {
      async.each(companies, updateCompanyPreferences, function (err) {
        if (err) {
          const message = err || 'Failed to Update company Preference'
          logger.serverLog(message, `${TAG}: exports.populate`, req.body, {user: req.user}, 'error') 
          res.status(500).json({status: 'failed', payload: err})
        } else {
          res.status(200).json({status: 'success', payload: 'updated successfully'})
        }
      })
    })
    .catch(err => {
      const message = err || 'Failed to find All Profile Objects'
      logger.serverLog(message, `${TAG}: exports.populate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}
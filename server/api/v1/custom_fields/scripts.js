// this file is meant to be deleted once the scripts are run - sojharo

const logger = require('../../../components/logger')
const DataLayer = require('./custom_field.datalayer')
const CUSTOMFIELD = '/api/v1/kiboengage/tags/scripts.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.populateDefaultFields = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Populate endpoint is hit:`)
  let defaultFields = [
    { default: true, description: 'Name of the city of the subscriber', type: 'text', name: 'City' },
    { default: true, description: 'Street Address of the subscriber', type: 'text', name: 'Street Address' },
    { default: true, description: 'Company name of the subscriber', type: 'text', name: 'Company' },
    { default: true, description: 'Country name of the subscriber', type: 'text', name: 'Country' },
    { default: true, description: 'Region of the subscriber', type: 'text', name: 'Region' },
    { default: true, description: 'Date of birth of the subscriber', type: 'date', name: 'Date of Birth' },
    { default: true, description: 'Marital Status of the subscriber', type: 'text', name: 'Marital Status' },
    { default: true, description: 'Phone number of the subscriber', type: 'phone', name: 'Phone Number' },
    { default: true, description: 'Email address of the subscriber', type: 'email', name: 'Email' },
    { default: true, description: 'Age of the subscriber', type: 'number', name: 'Age' }
  ]

  for (let i = 0; i < defaultFields.length; i++) {
    DataLayer.createOneCustomFieldObject(defaultFields[i])
      .then(createdObject => {
        logger.serverLog(CUSTOMFIELD, `created the default custom field for ${createdObject.name}`)
      })
      .catch(err => {
        logger.serverLog(CUSTOMFIELD, `Error found create default custom field : ${util.inspect(err)}`)
      })
  }
  sendSuccessResponse(res, 200, {status: 'success', description: 'script started'})
}

exports.normalizeData = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `normalise endpoint is hit:`)
  let defaultFields = [
    { default: true, description: 'Name of the city of the subscriber', type: 'text', name: 'City' },
    { default: true, description: 'Street Address of the subscriber', type: 'text', name: 'Street Address' },
    { default: true, description: 'Company name of the subscriber', type: 'text', name: 'Company' },
    { default: true, description: 'Country name of the subscriber', type: 'text', name: 'Country' },
    { default: true, description: 'Region of the subscriber', type: 'text', name: 'Region' },
    { default: true, description: 'Date of birth of the subscriber', type: 'date', name: 'Date of Birth' },
    { default: true, description: 'Marital Status of the subscriber', type: 'text', name: 'Marital Status' },
    { default: true, description: 'Phone number of the subscriber', type: 'phone', name: 'Phone Number' },
    { default: true, description: 'Email address of the subscriber', type: 'email', name: 'Email' },
    { default: true, description: 'Age of the subscriber', type: 'number', name: 'Age' }
  ]

  for (let i = 0; i < defaultFields.length; i++) {
    let query = {
      purpose: 'findAll',
      match: {
        name: req.body.name,
        companyId: req.body.companyId
      }
    }
    DataLayer.findCustomFieldsUsingQuery(query)
      .then(foundCustomFields => {
        logger.serverLog(CUSTOMFIELD, `created the default custom field for ${createdObject.name}`)
      })
      .catch(err => {
        logger.serverLog(CUSTOMFIELD, `Error found create default custom field : ${util.inspect(err)}`)
      })
  }
  sendSuccessResponse(res, 200, {status: 'success', description: 'script started'})
}
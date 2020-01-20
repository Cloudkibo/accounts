// this file is meant to be deleted once the scripts are run - sojharo

const logger = require('../../../components/logger')
const DataLayer = require('./custom_field.datalayer')
const CUSTOMFIELD = '/api/v1/kiboengage/tags/scripts.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.populateDefaultFields = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Populate endpoint is hit:`)
  let defaultFields = [
    { isDefault: true, description: 'Name of the city of the subscriber', type: 'text', name: 'City' },
    { isDefault: true, description: 'Street Address of the subscriber', type: 'text', name: 'Street Address' },
    { isDefault: true, description: 'Company name of the subscriber', type: 'text', name: 'Company' },
    { isDefault: true, description: 'Country name of the subscriber', type: 'text', name: 'Country' },
    { isDefault: true, description: 'Region of the subscriber', type: 'text', name: 'Region' },
    { isDefault: true, description: 'Date of birth of the subscriber', type: 'date', name: 'Date of Birth' },
    { isDefault: true, description: 'Marital Status of the subscriber', type: 'text', name: 'Marital Status' },
    { isDefault: true, description: 'Phone number of the subscriber', type: 'phone', name: 'Phone Number' },
    { isDefault: true, description: 'Email address of the subscriber', type: 'email', name: 'Email' },
    { isDefault: true, description: 'Age of the subscriber', type: 'number', name: 'Age' }
  ]

  for (let i = 0; i < defaultFields.length; i++) {
    DataLayer.createOneCustomFieldObject(defaultFields[i])
      .then(createdObject => {
        logger.serverLog(CUSTOMFIELD, `created the default custom field for ${createdObject.name}`)
      })
      .catch(err => {
        logger.serverLog(CUSTOMFIELD, `Error create default custom field : ${util.inspect(err)}`)
      })
  }
  sendSuccessResponse(res, 200, {status: 'success', description: 'script started'})
}

const logger = require('../../../components/logger')
const logicLayer = require('./companyuser.logiclayer')
const dataLayer = require('./companyuser.datalayer')
const TAG = '/api/v1/companyuser/companyuser.controller.js'

const util = require('util')

exports.genericFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findOneCompanyUserObjectUsingQuery(req.body)
    .then(result => {
      logger.serverLog(TAG, `query endpoint for c_user ${util.inspect(result)}`)
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

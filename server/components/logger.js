/*
 * Created by sojharo on 20/07/2017.
 */

const config = require('../config/environment/index')

const winston = require('winston')

// eslint-disable-next-line no-unused-expressions
require('winston-papertrail').Papertrail

const logger = new winston.Logger({
  transports: [
    // new (winston.transports.Console)(),
    new winston.transports.Papertrail({
      host: 'logs3.papertrailapp.com',
      port: 45576,
      colorize: true,
      attemptsBeforeDecay: 1
    })
  ]
})

exports.serverLog = function (label, data, type = 'info') {
  const namespace = `Accounts:${label}`
  const debug = require('debug')(namespace)

  if (config.env === 'development' || config.env === 'test') {
    debug(data)
    console.log(`${namespace} - ${data}`)
    // todo use log levels like info, warn, error and debug
    // logger.info(`${namespace} - ${data}`)
  } else {
    if (config.env === 'production' && config.papertrail_log_levels.indexOf(type) > -1) {
      logger.log(type, `${namespace} - ${data}`)
    } else {
      logger.log(type, `${namespace} - ${data}`)
    }
  }
}

exports.clientLog = function (label, data) {
  const namespace = `Accounts:client:${label}`
  const debug = require('debug')(namespace)

  if (config.env === 'development' || config.env === 'staging') {
    debug(data)
    // todo use log levels like info, warn, error and debug
    // logger.info(`${namespace} - ${data}`)
  } else {
    // logger.info(`${namespace} - ${data}`)
  }
}

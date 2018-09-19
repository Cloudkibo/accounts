const config = require('../config/environment/index')

exports.serverLog = function (label, data) {
  const namespace = `accounts:${label}`
  const debug = require('debug')(namespace)

  if (config.env === 'development' || config.env === 'test') {
    debug(data)
    // todo use log levels like info, warn, error and debug
    // logger.info(`${namespace} - ${data}`)
  }
}

exports.clientLog = function (label, data) {
  const namespace = `accounts:client:${label}`
  const debug = require('debug')(namespace)

  if (config.env === 'development' || config.env === 'test') {
    debug(data)
    // todo use log levels like info, warn, error and debug
  }
}

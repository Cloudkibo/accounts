process.env.NODE_ENV = process.env.NODE_ENV || 'development' // production

const express = require('express')
const mongoose = require('mongoose')
const Sentry = require('@sentry/node')
const config = require('./config/environment/index')

const app = express()
const httpApp = express()

const appObj = (config.env === 'production' || config.env === 'staging') ? app : httpApp

if (config.env === 'production' || config.env === 'staging') {
  Sentry.init({
    dsn: 'https://6c7958e0570f455381d6f17122fbd117@o132281.ingest.sentry.io/292307',
    release: 'Accounts@1.0.0',
    environment: config.env,
    serverName: 'Accounts',
    sendDefaultPii: true
  })
}

mongoose.connect(config.mongo.uri, config.mongo.options)

require('./config/express')(appObj)
require('./config/setup')(app, httpApp, config)
require('./routes')(appObj)
// require('./api/scripts/cpuProfiler')()

process.on('uncaughtException', function (exception) {
  console.log('asad catch:', exception)
})

module.exports = appObj

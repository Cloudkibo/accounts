process.env.NODE_ENV = process.env.NODE_ENV || 'development' // production

console.log('process1', process.memoryUsage())

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/environment/index')

console.log('process2', process.memoryUsage())

const app = express()
const httpApp = express()

const appObj = (config.env === 'production' || config.env === 'staging') ? app : httpApp
console.log('process3', process.memoryUsage())

const appObj = (config.env === 'production' || config.env === 'staging') ? app : httpApp
if (config.env === 'production' || config.env === 'staging') {
  const Raven = require('raven')
  Raven.config('https://6c7958e0570f455381d6f17122fbd117:d2041f4406ff4b3cb51290d9b8661a7d@sentry.io/292307', {
    environment: config.env,
    parseUser: ['name', 'email', 'domain', 'role', 'emailVerified']
  }).install()
  appObj.use(Raven.requestHandler())
}

console.log('process4', process.memoryUsage())
mongoose.connect(config.mongo.uri, config.mongo.options)

console.log('process5', process.memoryUsage())

require('./config/express')(appObj)
require('./config/setup')(app, httpApp, config)
require('./routes')(appObj)

console.log('process6', process.memoryUsage())

process.on('uncaughtException', function (exception) {
  console.log('asad catch:', exception)
})


console.log('process7', process.memoryUsage())
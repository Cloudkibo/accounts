/**
 * Express configuration
 */

'use strict'

const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const errorHandler = require('errorhandler')
const helmet = require('helmet')
const passport = require('passport')
const logger = require('../components/logger')
const TAG = 'server/config/express.js'

module.exports = function (app) {
  const env = app.get('env')

  /**
     * middleware to compress response body to optimize app
     * (it is better done on nginx proxy level)
     */

  app.use(compression())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
  app.use(methodOverride())

  // set the view engine to ejs
  app.set('view engine', 'ejs')

  // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
  app.use(cookieParser())

  app.use(passport.initialize())

  if (env === 'production') {
    /**
         * Helmet can help protect your app from some
         * well-known web vulnerabilities by setting
         * HTTP headers appropriately.
         */
    app.use(helmet())
  }

  /*
    Setup a general error handler for JsonSchemaValidation errors.
  */
  app.use(function (err, req, res, next) {
    if (err.name === 'JsonSchemaValidation') {
      const responseData = {
        statusText: 'Bad Request',
        jsonSchemaValidation: true,
        validations: err.validations
      }

      const message = err || `JsonSchemaValidation error`
      logger.serverLog(message, `${TAG}: ${req.path ? req.path : req.originalUrl}`, req.body, {responseData}, 'error')

      res.status(400).json(responseData)
    } else {
      // pass error to next error middleware handler
      next(err)
    }
  })

  if (env === 'development' || env === 'staging') {
    /**
         * HTTP request logger
         */

    app.use(morgan('dev'))

    /**
         * Development-only error handler middleware.
         */

    app.use(errorHandler()) // Error handler - has to be last
  }
}

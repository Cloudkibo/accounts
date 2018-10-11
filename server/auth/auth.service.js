'use strict'

const config = require('../config/environment')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const Users = require('../api/v1/user/user.model')
const validateJwt = expressJwt({secret: config.secrets.session})

const logger = require('../components/logger')

const TAG = 'auth/auth.service.js'

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated () {
  logger.serverLog(TAG, `inside isauthenticated`)
  return compose()
  // Validate jwt or api keys
    .use((req, res, next) => {
      logger.serverLog(TAG, `going to validate token`)
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = `Bearer ${req.query.access_token}`
      }
      validateJwt(req, res, next)
    })
    // Attach user to request
    .use((req, res, next) => {
      logger.serverLog(TAG, `inside users`)
      Users.findOne({_id: req.user._id}, (err, user) => {
        if (err) {
          logger.serverLog(TAG, `error in user fetching`)
          return res.status(500)
            .json({status: 'failed', description: 'Internal Server Error'})
        }
        if (!user) {
          logger.serverLog(TAG, `user not found`)
          return res.status(401)
            .json({status: 'failed', description: 'Unauthorized'})
        }
        logger.serverLog(TAG, `going to append user: ${user}`)
        req.user = user
        next()
      })
    })
}

// eslint-disable-next-line no-unused-vars
function isAuthorizedWebHookTrigger () {
  return compose().use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
      req.socket.remoteAddress || req.connection.socket.remoteAddress
    logger.serverLog(TAG, req.ip)
    logger.serverLog(TAG, ip)
    logger.serverLog(TAG, 'This is middleware')
    logger.serverLog(TAG, req.body)
    // We need to change it to based on the requestee app
    if (ip === '165.227.130.222') next()
    else res.send(403)
  })
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function isAuthorizedSuperUser () {
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements (req, res, next) {
      if (req.user.isSuperUser) {
        next()
      } else {
        res.send(403)
      }
    })
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken (id) {
  return jwt.sign({_id: id}, config.secrets.session,
    {expiresIn: 60 * 60 * 24 * 4})
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie (req, res) {
  if (!req.user) {
    return res.status(404).json({
      status: 'failed',
      description: 'Something went wrong, please try again.'
    })
  }
  const token = signToken(req.user._id)
  logger.serverLog(TAG, `Here is the signed token: ${token}`)
  res.cookie('token', token)
  // We will change it to based on the request of project
  return res.status(200).json({status: 'success', description: 'successfully logged in'})
}

exports.isAuthenticated = isAuthenticated
exports.signToken = signToken
exports.setTokenCookie = setTokenCookie
exports.isAuthorizedSuperUser = isAuthorizedSuperUser

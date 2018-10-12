'use strict'

const config = require('../config/environment')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const UserLogicLayer = require('./../api/v1/user/user.logiclayer')
const UserDataLayer = require('./../api/v1/user/user.datalayer')
const CompanyUserDataLayer = require('./../api/v1/companyuser/companyuser.datalayer')
const PermissionDataLayer = require('./../api/v1/permissions/permissions.datalayer')
const CompanyProfileDataLayer = require('./../api/v1/companyprofile/companyprofile.datalayer')
const PermissionPlanDataLayer = require('./../api/v1/permissions_plan/permissions_plan.datalayer')
const validateJwt = expressJwt({secret: config.secrets.session})
const util = require('util')

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
      let userPromise = UserDataLayer.findOneUserObject(req.user._id)
      let companyUserPromise = CompanyUserDataLayer.findOneCompanyUserObjectUsingQuery({userId: req.user._id})
      let permissionsPromise = PermissionDataLayer.findOneUserPermissionsUsingQUery({userId: req.user._id})

      Promise.all([userPromise, companyUserPromise, permissionsPromise])
        .then(result => {
          let user = result[0]
          let companyUser = result[1]
          let permissions = result[2]
          let company

          if (!user || !companyUser || !permissions) {
            let resp = UserLogicLayer.getResponse(user, companyUser, permissions)
            return res.status(404).json(resp)
          }

          CompanyProfileDataLayer.findOneCPWithPlanPop({_id: companyUser.companyId})
            .then(foundCompany => {
              company = foundCompany
              return PermissionPlanDataLayer.findOnePermissionObjectUsingQuery({plan_id: foundCompany.planId._id})
            })
            .then(plan => {
              if (!plan) {
                return res.status(404).json({
                  status: 'failed',
                  description: 'Fatal Error, plan not set for this user. Please contact support'
                })
              }
              user = user.toObject()
              user.companyId = companyUser.companyId
              user.permissions = permissions
              user.currentPlan = company.planId
              user.last4 = company.stripe.last4
              user.plan = plan
              user.uiMode = config.uiModes[user.uiMode]

              req.user = user
              next()
            })
            .catch(err => {
              logger.serverLog(TAG, `Error at Plan Catch: ${util.inspect(err)}`)
              return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
            })
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at Promise All: ${util.inspect(err)}`)
          return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
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

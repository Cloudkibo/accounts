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
const PagesDataLayer = require('./../api/v1/pages/pages.datalayer')
const needle = require('needle')
const _ = require('lodash')
const validateJwt = expressJwt({secret: config.secrets.session})
const util = require('util')

const logger = require('../components/logger')

const TAG = 'auth/auth.service.js'

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated () {
  return compose()
  // Validate jwt or api keys
    .use((req, res, next) => {
      if (req.headers.hasOwnProperty('is_kibo_product') || req.headers.hasOwnProperty('consumer_id')) {
        isAuthorizedWebHookTrigger(req, res, next)
      } else {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = `Bearer ${req.query.access_token}`
        }
        validateJwt(req, res, next)
      }
    })
    // Attach user to request
    .use((req, res, next) => {
      var userId
      if (req.user) {
        userId = req.user._id
        UserDataLayer.findOneUserObject({_id: userId})
          .then(loggedInUser => {
            if (loggedInUser.actingAsUser) {
              if (loggedInUser.isSuperUser) {
                UserDataLayer.findOneUserObjectUsingQuery({domain_email: loggedInUser.actingAsUser.domain_email})
                  .then(actingAsUser => {
                    attachUserAndActingUserInfo(req, res, next, loggedInUser, actingAsUser)
                  })
                  .catch(err => {
                    const message = err || 'Unable to get loggin in user details'
                    logger.serverLog(message, `${TAG}: exports.isAuthenticated`, req.body, {user: req.user}, 'error') 
                    return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
                  })
              } else {
                const message = 'You are not allowed to perform this action'
                logger.serverLog(message, `${TAG}: exports.isAuthenticated`, req.body, {user: req.user}, 'error') 
                return res.status(403).json({status: 'failed', payload: 'You are not allowed to perform this action'})
              }
            } else {
              attachUserToRequest(req, res, next, userId)
            }
          })
          .catch(err => {
            const message = err || 'Unable to get loggin in user details'
            logger.serverLog(message, `${TAG}: exports.isAuthenticated`, req.body, {user: req.user}, 'error') 
            return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
          })
      } else if (req.headers.hasOwnProperty('consumer_id')) {
        userId = req.headers.consumer_id
        attachUserToRequest(req, res, next, userId)
      } else {
        next()
      }
    })
}

function attachUserAndActingUserInfo (req, res, next, loggedInUser, actingAsUser) {
  let actingAsCompanyUser = CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({userId: actingAsUser._id})
  let actingAsUserPermissions = PermissionDataLayer.findOneUserPermissionsUsingQUery({userId: actingAsUser._id})

  Promise.all([actingAsCompanyUser, actingAsUserPermissions])
    .then(result => {
      let actingCompanyUser = result[0]
      let actingUserpermissions = result[1]
      let companyActingUser

      if (!loggedInUser || !actingCompanyUser || !actingUserpermissions) {
        let resp = UserLogicLayer.getResponseForUserView(loggedInUser, actingCompanyUser, actingUserpermissions)
        return res.status(404).json(resp)
      }

      CompanyProfileDataLayer.findOneCPWithPlanPop({_id: actingCompanyUser.companyId})
        .then(foundCompany => {
          companyActingUser = foundCompany
          return PermissionPlanDataLayer.findOnePermissionObjectUsingQuery({plan_id: foundCompany.planId._id})
        })
        .then(plan => {
          if (!plan) {
            return res.status(404).json({
              status: 'failed',
              description: 'Fatal Error, plan not set for this user. Please contact support'
            })
          } else {
            var actingUser = actingAsUser.toObject()
            actingUser.companyId = actingCompanyUser.companyId
            actingUser.permissions = actingUserpermissions
            actingUser.currentPlan = companyActingUser.planId
            actingUser.last4 = companyActingUser.stripe.last4
            actingUser.plan = plan
            actingUser.uiMode = config.uiModes[actingAsUser.uiMode]

            req.user = loggedInUser
            req.actingAsUser = actingUser
            next()
          }
        })
        .catch(err => {
          const message = err || 'Error at Plan Catch:'
          logger.serverLog(message, `${TAG}: exports.isAuthenticated`, req.body, {user: req.user}, 'error') 
          return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
        })
    })
    .catch(err => {
      const message = err || 'Error at Promise All:'
      logger.serverLog(message, `${TAG}: exports.isAuthenticated`, req.body, {user: req.user}, 'error') 
      return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
    })
}

function attachUserToRequest (req, res, next, userId) {
  let userPromise = UserDataLayer.findOneUserObject(userId)
  let companyUserPromise = CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({userId: userId})
  let permissionsPromise = PermissionDataLayer.findOneUserPermissionsUsingQUery({userId: userId})
  let updateLastLogin = UserDataLayer.updateOneUserObjectUsingQuery({_id: userId}, {lastLogin: new Date()})

  Promise.all([userPromise, companyUserPromise, permissionsPromise, updateLastLogin])
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
          const message = err || 'Error at Plan Catch:'
          logger.serverLog(message, `${TAG}: exports.attachUserToRequest`, req.body, {user: req.user}, 'error')     
          return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
        })
    })
    .catch(err => {
      const message = err || 'Error at Promise All:'
      logger.serverLog(message, `${TAG}: exports.attachUserToRequest`, req.body, {user: req.user}, 'error')     
      return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
    })
}
function isSuperUserActingAsCustomer (modeOfAction) {
  return compose()
    .use((req, res, next) => {
      if (req.actingAsUser) {
        if (modeOfAction === 'write') {
          return res.status(403)
            .json({status: 'failed', description: `You are not allowed to perform this action`})
        } else {
          req.user = req.actingAsUser
          next()
        }
      } else {
        next()
      }
    })
}
// eslint-disable-next-line no-unused-vars
function isAuthorizedWebHookTrigger (req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
    req.socket.remoteAddress || req.connection.socket.remoteAddress
  // We need to change it to based on the requestee app
  if (config.allowedIps.indexOf(ip) > -1) next()
  else res.send(403)
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
  logger.serverLog(`Here is the signed token: ${token}`, TAG)
  res.cookie('token', token)
  // We will change it to based on the request of project
  return res.status(200).json({status: 'success', description: 'successfully logged in', token})
}

function fetchPages (url, user, req, token) {
  const options = {
    headers: {
      'X-Custom-Header': 'CloudKibo Web Application'
    },
    json: true

  }
  needle.get(url, options, (err, resp) => {
    if (err !== null) {
      logger.serverLog(TAG, 'error from graph api to get pages list data: ')
      logger.serverLog(TAG, JSON.stringify(err))
      const message = err || 'error from graph api to get pages list data:'
      logger.serverLog(message, `${TAG}: exports.fetchPages`, req.body, {user: req.user}, 'error')
      return
    }
    const data = resp.body.data
    const cursor = resp.body.paging
    if (data) {
      data.forEach((item) => {
        //  createMenuForPage(item)
        const options2 = {
          url: `https://graph.facebook.com/v6.0/${item.id}/?fields=fan_count,username&access_token=${item.access_token}`,
          qs: {access_token: item.access_token},
          method: 'GET'
        }
        needle.get(options2.url, options2, (error, fanCount) => {
          if (error !== null) {
            return logger.serverLog(TAG, `Error occurred ${error}`)
          } else {
            // logger.serverLog(TAG, `Data by fb for page likes ${JSON.stringify(
            //   fanCount.body.fan_count)}`)
            CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({domain_email: user.domain_email})
              .then(companyUser => {
                if (!companyUser) {
                  return logger.serverLog(TAG, {
                    status: 'failed',
                    description: 'The user account does not belong to any company. Please contact support'
                  })
                }
                PagesDataLayer.findPageObjects({pageId: item.id, userId: user._id, companyId: companyUser.companyId})
                  .then(pages => {
                    let page = pages[0]
                    if (!page) {
                      let payloadPage = {
                        pageId: item.id,
                        pageName: item.name,
                        accessToken: item.access_token,
                        userId: user._id,
                        companyId: companyUser.companyId,
                        likes: fanCount.body.fan_count,
                        pagePic: `https://graph.facebook.com/v6.0/${item.id}/picture`,
                        connected: false
                      }
                      if (fanCount.body.username) {
                        payloadPage = _.merge(payloadPage,
                          {pageUserName: fanCount.body.username})
                      }
                      PagesDataLayer.savePageObject(payloadPage)
                        .then(page => {
                          logger.serverLog(TAG,
                            `Page ${item.name} created with id ${page.pageId}`)
                        })
                        .catch(err => {
                          const message = err || 'Unable to create Page Object'
                          logger.serverLog(message, `${TAG}: exports.fetchPages`, req.body, {user: req.user}, 'error')
                        })
                    } else {
                      let updatedPayload = {
                        likes: fanCount.body.fan_count,
                        pagePic: `https://graph.facebook.com/v6.0/${item.id}/picture`,
                        accessToken: item.access_token
                      }
                      if (fanCount.body.username) {
                        updatedPayload['pageUserName'] = fanCount.body.username
                      }
                      PagesDataLayer.updatePageObjectUsingQuery({_id: page._id}, updatedPayload, {user: req.user})
                        .then(updated => {
                          logger.serverLog(TAG,
                            `page updated successfuly ${JSON.stringify(updated)}`)
                        })
                        .catch(err => {
                          const message = err || 'failed to update page:'
                          logger.serverLog(message, `${TAG}: exports.fetchPages`, req.body, {user: req.user}, 'error')                    
                        })
                    }
                  })
                  .catch(err => {
                    const message = err || 'Error while fetching pages'
                    return logger.serverLog(message, `${TAG}: exports.fetchPages`, req.body, {user: req.user}, 'error')
                    
                  })
              })
              .catch(err => {
                const message = err || 'Error while fetching user'
                return logger.serverLog(message, `${TAG}: exports.fetchPages`, req.body, {user: req.user}, 'error')
            
              })
          }
        })
      })
    } else {
      logger.serverLog('Empty response from graph API to get pages list data', TAG)
    }
    if (cursor && cursor.next) {
      fetchPages(cursor.next, user, req)
    } else {
      logger.serverLog('Undefined Cursor from graph API', TAG)
    }
  })
}

function saveLastLoginIpAddress (req) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress

  logger.serverLog(TAG, `IP found: ${ip}`, 'debug')

  if (ip.includes('ffff')) {
    let temp = ip.split(':')
    ip = temp[temp.length - 1]
  }

  UserDataLayer.updateOneUserObjectUsingQuery(
    { _id: req.user._id },
    { lastLoginIPAddress: ip },
    { upsert: false }
  )
    .then(result => logger.serverLog('updated user ip address for last login', TAG))
    .catch(err => logger.serverLog(`error in updating IP address of user for last login ${JSON.stringify(err)}`, `${TAG}: exports.fetchPages`, req.body, {user: req.user}, 'error')
    )
}

exports.isAuthenticated = isAuthenticated
exports.signToken = signToken
exports.setTokenCookie = setTokenCookie
exports.isAuthorizedSuperUser = isAuthorizedSuperUser
exports.fetchPages = fetchPages
exports.saveLastLoginIpAddress = saveLastLoginIpAddress
exports.isSuperUserActingAsCustomer = isSuperUserActingAsCustomer

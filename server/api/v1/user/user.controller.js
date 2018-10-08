const logger = require('../../../components/logger')
const config = require('./../../../config/environment/index')
const utility = require('./../../../components/utility')
const logicLayer = require('./user.logiclayer')
const dataLayer = require('./user.datalayer')
const PlanDataLayer = require('./../plans/plans.datalayer')
const CompanyProfileDataLayer = require('./../companyprofile/companyprofile.datalayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const FeatureUsageDataLayer = require('./../featureUsage/usage.datalayer')
const PermissionDataLayer = require('./../permissions/permissions.datalayer')
const VertificationTokenDataLayer = require('./../verificationtoken/verificationtoken.datalayer')
const auth = require('./../../../auth/auth.service')
const TAG = '/api/v1/user/user.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : res.status(500).json({status: 'failed', payload: 'ID is not provided'})

  dataLayer.findOneUserObject(id)
    .then(userObject => {
      return res.status(200).json({status: 'success', payload: userObject})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller index')
  let isTeam = logicLayer.isTeamAccount(req.body)

  logicLayer
    .isEmailAndDomainFound(req.body)
    .then(result => {
      if (result.email) {
        return res.status(422).json({
          status: 'failed',
          description: 'This email address already has an account on KiboPush. Contact support for more information.'
        })
      } else if (result.domain) {
        return res.status(422).json({
          status: 'failed',
          description: 'This workspace name already has an account on KiboPush. Contact support for more information.'
        })
      } else {
        let domain = logicLayer.getRandomString()
        let payload = logicLayer.prepareUserPayload(req.body, isTeam, domain)
        dataLayer.createUserObject(payload)
          .then(user => {
            PlanDataLayer.findAllPlanObjectsUsingQuery({unique_ID: {$in: ['plan_D', 'plan_B']}})
              .then(result => {
                // Separate default plans
                let { defaultPlanTeam, defaultPlanIndividual } = logicLayer.defaultPlans(result)
                let companyprofileData = logicLayer
                  .prepareCompanyProfile(
                    req.body, user._id, isTeam, domain,
                    isTeam ? defaultPlanTeam : defaultPlanIndividual)
                CompanyProfileDataLayer
                  .createProfileObject(companyprofileData)
                  .then(companySaved => {
                    let companyUsageData = logicLayer.companyUsageData(companySaved._id)
                    FeatureUsageDataLayer.createCompanyUsage(companyUsageData)
                      .then()
                      .catch(err => { return res.status(500).json({status: 'failed', description: `err: ${err}`}) })
                    // Create customer on stripe
                    logicLayer.createCustomerOnStripe(req.body.email, req.body.name, companySaved)
                    let companyUserPayload = logicLayer.prepareCompanyUser(companySaved, user)
                    CompanyUserDataLayer.CreateCompanyUserObject(companyUserPayload)
                      .then(companyUserSaved => {
                        PermissionDataLayer.createUserPermission({companyId: companySaved._id, userId: user._id})
                          .then(permissionSaved => {
                            let token = auth.signToken(user._id)
                            res.status(201)
                              .json({status: 'success',
                                token: token,
                                userid: user._id,
                                type: isTeam ? 'company' : 'individual'})
                          })
                      })
                    let tokenString = logicLayer.getRandomString()
                    VertificationTokenDataLayer
                      .createVerificationToken({userId: user._id, token: tokenString})
                      .then()
                      .catch(err => logger.serverLog(TAG, `New Token save : ${JSON.stringify(err)}`))
                    // Sending email using mailchimp if team account
                    if (isTeam) logicLayer.sendEmailUsingMailChimp(req.body)
                    // Sending email via sendgrid
                    let sendgrid = utility.getSendGridObject()
                    let email = new sendgrid.Email(logicLayer.emailHeader(req.body))
                    email = logicLayer.setEmailBody(email, tokenString, req.body)

                    sendgrid.send(email, function (err, json) {
                      if (err) logger.serverLog(TAG, `Internal Server Error on sending email : ${JSON.stringify(err)}`)
                    })
                    // Sending email to sojharo and sir
                    let inHouseEmail = new sendgrid.Email(logicLayer.inHouseEmailHeader(req.body))
                    inHouseEmail = logicLayer.setInHouseEmailBody(inHouseEmail, req.body)

                    if (config.env === 'production') {
                      sendgrid.send(inHouseEmail, function (err, json) {
                        if (err) { logger.serverLog(TAG, `Internal Server Error on sending email : ${err}`) }
                      })
                    }
                  })
              })
              .catch(err => {
                return res.status(500).json({status: 'failed', payload: err})
              })
          })
          .catch(err => {
            return res.status(500).json({status: 'failed', payload: err})
          })
      }
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : res.status(500).json({status: 'failed', payload: 'ID is not provided'})

  let name = req.body.name ? req.body.name : false
  let email = req.body.email ? req.body.email : false
  let uiMode = req.body.uiMode ? req.body.uiMode : false

  let payload = logicLayer.prepareUpdateUserPayload(name, email, uiMode)
  if (Object.keys(payload).length > 0) {
    dataLayer.updateUserObject(id, payload)
      .then(result => {
        return res.status(200).json({status: 'success', payload: result})
      })
      .catch(err => {
        logger.serverLog(TAG, `Error at update user ${util.inspect(err)}`)
        return res.status(500).json({status: 'failed', payload: err})
      })
  } else {
    logger.serverLog(TAG, `No field provided to update`)
    return res.status(500).json({status: 'failed', payload: 'Provide field to update'})
  }
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : res.status(500).json({status: 'failed', payload: 'ID is not provided'})

  dataLayer.deleteUserObject(id)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.enableDelete = function (req, res) {
  logger.serverLog(TAG, 'Enabling GDPR Delete')

  let deleteInformation = {delete_option: req.body.delete_option, deletion_date: req.body.deletion_date}
  dataLayer.updateUserObject(req.params._id, {deleteInformation})
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at enabling GDPR delete ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.cancelDeletion = function (req, res) {
  logger.serverLog(TAG, 'Disabling GDPR Delete')

  let deleteInformation = {delete_option: 'NONE', deletion_date: ''}
  dataLayer.updateUserObject(req.params._id, {deleteInformation})
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at enabling GDPR delete ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdateUserObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

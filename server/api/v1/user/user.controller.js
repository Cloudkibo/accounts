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
const PermissionPlanDataLayer = require('./../permissions_plan/permissions_plan.datalayer')
const VertificationTokenDataLayer = require('./../verificationtoken/verificationtoken.datalayer')
const InviteAgentTokenDataLayer = require('./../inviteagenttoken/inviteagenttoken.datalayer')
const InvitationDataLayer = require('./../invitations/invitations.datalayer')
const auth = require('./../../../auth/auth.service')
const TAG = '/api/v1/user/user.controller.js'

const util = require('util')
const _ = require('lodash')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller index')

  let userPromise = dataLayer.findOneUserObject(req.user._id)
  let companyUserPromise = CompanyUserDataLayer.findOneCompanyUserObjectUsingQuery({userId: req.user._id})
  let permissionsPromise = PermissionDataLayer.findOneUserPermissionsUsingQUery({userId: req.user._id})

  Promise.all([userPromise, companyUserPromise, permissionsPromise])
    .then(result => {
      let user = result[0]
      let companyUser = result[1]
      let permissions = result[2]
      let company

      if (!user || !companyUser || !permissions) {
        let resp = logicLayer.getResponse(user, companyUser, permissions)
        return res.status(404).json(resp)
      }

      CompanyProfileDataLayer.findOneCompanyProfileObjectUsingQuery({_id: companyUser.companyId})
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

          res.status(200).json({status: 'success', payload: user})
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
}

exports.updateSkipConnect = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller updateSkipConnect')

  dataLayer.findOneAndUpdateUsingQuery({_id: req.user._id}, {skippedFacebookConnect: true}, {new: true})
    .then(user => {
      logger.serverLog(TAG, `sending success message ${util.inspect(user)}`)
      return res.status(200).json({status: 'success', payload: user})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update skip connect: ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
    })
}

exports.updateChecks = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller updateChecks')

  dataLayer.findOneUserObject(req.user._id)
    .then(user => {
      // return if user not found
      if (!user) return res.status(404).json({status: 'failed', description: 'User not found'})

      if (req.body.getStartedSeen) user.getStartedSeen = req.body.getStartedSeen
      if (req.body.dashboardTourSeen) user.dashboardTourSeen = req.body.dashboardTourSeen
      if (req.body.surveyTourSeen) user.surveyTourSeen = req.body.surveyTourSeen
      if (req.body.convoTourSeen) user.convoTourSeen = req.body.convoTourSeen
      if (req.body.pollTourSeen) user.pollTourSeen = req.body.pollTourSeen
      if (req.body.growthToolsTourSeen) user.growthToolsTourSeen = req.body.growthToolsTourSeen
      if (req.body.subscriberTourSeen) user.subscriberTourSeen = req.body.subscriberTourSeen
      if (req.body.liveChatTourSeen) user.liveChatTourSeen = req.body.liveChatTourSeen
      if (req.body.autoPostingTourSeen) user.autoPostingTourSeen = req.body.autoPostingTourSeen
      if (req.body.mainMenuTourSeen) user.mainMenuTourSeen = req.body.mainMenuTourSeen
      if (req.body.subscribeToMessengerTourSeen) user.subscribeToMessengerTourSeen = req.body.subscribeToMessengerTourSeen
      if (req.body.pagesTourSeen) user.pagesTourSeen = req.body.pagesTourSeen
      if (req.body.wizardSeen) user.wizardSeen = req.body.wizardSeen

      dataLayer.saveUserObject(user).then(result => {
        logger.serverLog(TAG, `sending success message ${util.inspect(user)}`)
        return res.status(200).json({status: 'success', payload: user})
      })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at User find: ${util.inspect(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
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
        logger.serverLog(TAG, payload)
        dataLayer.createUserObject(payload)
          .then(user => {
            logger.serverLog(TAG, `User Found: ${user}`)
            PlanDataLayer.findAllPlanObjectsUsingQuery({unique_ID: {$in: ['plan_D', 'plan_B']}})
              .then(result => {
                logger.serverLog(TAG, `Plans Found: ${util.inspect(result)}`)
                // Separate default plans
                let { defaultPlanTeam, defaultPlanIndividual } = logicLayer.defaultPlans(result)
                let companyprofileData = logicLayer
                  .prepareCompanyProfile(
                    req.body, user._id, isTeam, domain,
                    isTeam ? defaultPlanTeam : defaultPlanIndividual)
                CompanyProfileDataLayer
                  .createProfileObject(companyprofileData)
                  .then(companySaved => {
                    logger.serverLog(TAG, `Company created: ${companySaved}`)
                    let companyUsageData = logicLayer.companyUsageData(companySaved._id)
                    FeatureUsageDataLayer.createCompanyUsage(companyUsageData)
                      .then()
                      .catch(err => {
                        logger.serverLog(TAG, `Error at: ${err}`)
                        return res.status(500).json({status: 'failed', description: `err: ${err}`})
                      })
                    // Create customer on stripe
                    logicLayer.createCustomerOnStripe(req.body.email, req.body.name, companySaved)
                    let companyUserPayload = logicLayer.prepareCompanyUser(companySaved, user)
                    CompanyUserDataLayer.CreateCompanyUserObject(companyUserPayload)
                      .then(companyUserSaved => {
                        logger.serverLog(TAG, `Company User created: ${companyUserSaved}`)
                        PermissionDataLayer.createUserPermission({companyId: companySaved._id, userId: user._id})
                          .then(permissionSaved => {
                            logger.serverLog(TAG, `Permission Saved: ${permissionSaved}`)
                            let token = auth.signToken(user._id)
                            res.cookie('token', token)
                            res.status(201)
                              .json({status: 'success',
                                token: token,
                                userid: user._id,
                                type: isTeam ? 'company' : 'individual'})
                          })
                          .catch(err => {
                            logger.serverLog(TAG, `Error at: ${err}`)
                            return res.status(500).json({status: 'failed', description: `err: ${err}`})
                          })
                      })
                      .catch(err => {
                        logger.serverLog(TAG, `Error at: ${err}`)
                        return res.status(500).json({status: 'failed', description: `err: ${err}`})
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
                    logger.serverLog(TAG, util.inspect(email))
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
                  .catch(err => {
                    logger.serverLog(TAG, `Error at: ${err}`)
                    return res.status(500).json({status: 'failed', description: `err: ${err}`})
                  })
              })
              .catch(err => {
                logger.serverLog(TAG, `Error at: ${err}`)
                return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
              })
          })
          .catch(err => {
            logger.serverLog(TAG, `Error at: ${err}`)
            return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
          })
      }
    })
}

exports.joinCompany = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller joinCompany')
  // Never delete following variables. They are used in Promise chaining
  let invitationToken
  let companyUser
  let user
  let companyUserSaved
  let permissionSaved
  let tokenString

  InviteAgentTokenDataLayer.findOneCompanyUserObjectUsingQuery({token: req.body.token})
    .then(token => {
      invitationToken = token
      if (!invitationToken) {
        return res.status(404).json({
          status: 'failed',
          description: 'Invitation token invalid or expired. Please contact admin to invite you again.'
        })
      }
      return CompanyUserDataLayer
        .findOneCompanyUserObjectUsingQuery({companyId: invitationToken.companyId, role: 'buyer'})
    })
    .then(compUser => {
      logger.serverLog(TAG, `Found Company User : ${util.inspect(compUser)}`)
      companyUser = compUser
      return dataLayer.findOneUserObject(compUser.userId)
    })
    .then(foundUser => {
      if (!companyUser || !foundUser) {
        return res.status(404).json({status: 'failed', description: 'user or company user not found'})
      } else {
        logger.serverLog(TAG, `foundUser : ${util.inspect(foundUser)}`)
        let accountData = {
          name: req.body.name,
          email: req.body.email,
          domain: invitationToken.domain,
          password: req.body.password,
          domain_email: invitationToken.domain + '' + req.body.email,
          accountType: 'team',
          role: invitationToken.role,
          uiMode: foundUser.uiMode
        }
        return dataLayer.createUserObject(accountData)
      }
    })
    .then(createdUser => {
      user = createdUser
      logger.serverLog(TAG, `Created User : ${util.inspect(createdUser)}`)
      let companyUserData = {
        companyId: invitationToken.companyId,
        userId: createdUser._id,
        domain_email: createdUser.domain_email,
        role: invitationToken.role
      }
      return CompanyUserDataLayer.CreateCompanyUserObject(companyUserData)
    })
    .then(createdCompanyUser => {
      companyUserSaved = createdCompanyUser
      logger.serverLog(TAG, `Created Company User : ${util.inspect(createdCompanyUser)}`)
      let permissionsPayload = { companyId: invitationToken.companyId, userId: user._id }

      permissionsPayload = _.merge(permissionsPayload, config.permissions[invitationToken.role] || {})
      return PermissionDataLayer.createUserPermission(permissionsPayload)
    })
    .then(createdPermissions => {
      permissionSaved = createdPermissions
      logger.serverLog(TAG, `Created Permissions: ${util.inspect(createdPermissions)}`)

      let token = auth.signToken(user._id)
      res.clearCookie('email')
      res.clearCookie('companyId')
      res.clearCookie('companyName')
      res.clearCookie('domain')
      res.clearCookie('name')
      res.cookie('token', token)
      res.cookie('userid', user._id)
      res.status(201).json({status: 'success', token: token})

      tokenString = logicLayer.getRandomString()
      let tokenPromise = VertificationTokenDataLayer.createVerificationToken({userId: user._id, token: tokenString})
      let inviRemPromise = InvitationDataLayer
        .deleteOneInvitationObjectUsingQuery({email: req.body.email, companyId: invitationToken.companyId})
      let inviAgentTokenRemove = InviteAgentTokenDataLayer
        .deleteOneInvitationTokenObjectUsingQuery({token: req.body.token})

      return Promise.all([tokenPromise, inviRemPromise, inviAgentTokenRemove])
    })
    .then(resultAll => {
      logger.serverLog(TAG, `Result All: ${util.inspect(resultAll)}`)

      // Sending email via sendgrid
      let sendgrid = utility.getSendGridObject()
      let email = new sendgrid.Email(logicLayer.emailHeader(req.body))
      email = logicLayer.setEmailBody(email, tokenString, req.body)
      logger.serverLog(TAG, util.inspect(email))
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
    .catch(err => {
      logger.serverLog(TAG, `Error at: ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
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

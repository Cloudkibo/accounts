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
const needle = require('needle')
const util = require('util')
const _ = require('lodash')
const moment = require('moment')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const { updateCompanyUsage } = require('../../global/billingPricing')

exports.index = function (req, res) {
  let userPromise = dataLayer.findOneUserObject(req.user._id)
  let companyUserPromise = CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({userId: req.user._id})
  let permissionsPromise = PermissionDataLayer.findOneUserPermissionsUsingQUery({userId: req.user._id})

  Promise.all([userPromise, companyUserPromise, permissionsPromise])
    .then(result => {
      let user = result[0]
      let companyUser = result[1]
      let permissions = result[2]
      let company

      if (!user || !companyUser || !permissions) {
        let resp = logicLayer.getResponse(user, companyUser, permissions)
        sendErrorResponse(res, 404, resp)
      }

      CompanyProfileDataLayer.findOneCPWithPlanPop({_id: companyUser.companyId}, true, 'planId')
        .then(foundCompany => {
          company = foundCompany
          return PermissionPlanDataLayer.findOnePermissionObjectUsingQuery({plan_id: foundCompany.planId._id})
        })
        .then(plan => {
          if (!plan) {
            sendErrorResponse(res, 500, 'Fatal Error, plan not set for this user. Please contact support')
          }
          user = user.toObject()
          user.companyId = companyUser.companyId
          user.permissions = permissions
          user.currentPlan = company.planId
          user.trialPeriod = company.trialPeriod
          user.last4 = company.stripe.last4
          user.plan = plan
          user.uiMode = config.uiModes[user.uiMode]

          sendSuccessResponse(res, 200, user)
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at Plan Catch: ${util.inspect(err)}`)
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at Promise All: ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.updateMode = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller updateMode')
  // Never delete following variables. They are used in Promise chaining
  let user
  let companyUser
  let permissions
  let company
  let userPromise = dataLayer.findOneUserObject(req.user._id)
  let companyUserPromise = CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({userId: req.body._id})
  let permissionsPromise = PermissionDataLayer.findOneUserPermissionsUsingQUery({userId: req.body._id})

  Promise.all([userPromise, companyUserPromise, permissionsPromise])
    .then(result => {
      user = result[0]
      companyUser = result[1]
      permissions = result[2]
      if (!user || !companyUser || !permissions) {
        let resp = logicLayer.getResponse(user, companyUser, permissions)
        sendErrorResponse(res, 404, resp)
      }
      user.advancedMode = req.body.advancedMode
      return dataLayer.saveUserObject(user)
    })
    .then(savedUser => {
      return CompanyProfileDataLayer.findOneCPWithPlanPop({_id: companyUser.companyId})
    })
    .then(foundCompany => {
      company = foundCompany
      return PermissionPlanDataLayer.findOnePermissionObjectUsingQuery({plan_id: foundCompany.planId._id})
    })
    .then(plan => {
      if (!plan) {
        sendErrorResponse(res, 500, 'Fatal Error, plan not set for this user. Please contact support')
      }
      user = user.toObject()
      user.companyId = companyUser.companyId
      user.permissions = permissions
      user.currentPlan = company.planId
      user.last4 = company.stripe.last4
      user.plan = plan
      user.uiMode = config.uiModes[user.uiMode]

      sendSuccessResponse(res, 200, user)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at Promise All: ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.updateSkipConnect = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller updateSkipConnect')

  dataLayer.findOneAndUpdateUsingQuery({_id: req.user._id}, {skippedFacebookConnect: true}, {new: true})
    .then(user => {
      logger.serverLog(TAG, `sending success message ${util.inspect(user)}`)
      sendSuccessResponse(res, 200, user)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update skip connect: ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.fbAppId = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller fbAppId')
  sendSuccessResponse(res, 200, config.facebook.clientID)
}

exports.updateChecks = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller updateChecks')

  dataLayer.findOneUserObject(req.user._id)
    .then(user => {
      // return if user not found
      if (!user) sendErrorResponse(res, 404, 'User not found')

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
        sendSuccessResponse(res, 200, user)
      })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at User find: ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller index')
  let isTeam = logicLayer.isTeamAccount(req.body)
  logicLayer
    .isEmailAndDomainFound(req.body)
    .then(result => {
      logger.serverLog(TAG, 'result')
      if (result.email) {
        sendErrorResponse(res, 422, 'This email address already has an account on KiboPush. Contact support for more information.')
      } else if (result.domain) {
        sendErrorResponse(res, 422, 'This workspace name already has an account on KiboPush. Contact support for more information.')
      } else {
        let domain = logicLayer.getRandomString()
        let payload = logicLayer.prepareUserPayload(req.body, isTeam, domain)
        dataLayer.createUserObject(payload)
          .then(user => {
            logger.serverLog(TAG, `User Found: ${user}`)
            PlanDataLayer.findAllPlanObjectsUsingQuery({default: true})
              .then(plans => {
                const defaultPlan = plans[0]
                logger.serverLog(TAG, `Default plan Found: ${util.inspect(defaultPlan)}`)
                let companyprofileData = logicLayer.prepareCompanyProfile(req.body, user._id, isTeam, domain, defaultPlan)
                CompanyProfileDataLayer
                  .createProfileObject(companyprofileData)
                  .then(companySaved => {
                    logger.serverLog(TAG, `Company created: ${companySaved}`)
                    let companyUsageData = logicLayer.companyUsageData(companySaved._id)
                    FeatureUsageDataLayer.createCompanyUsage(companyUsageData)
                      .then()
                      .catch(err => {
                        logger.serverLog(TAG, `Error at: ${err}`)
                        sendErrorResponse(res, 500, err)
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
                            sendErrorResponse(res, 500, err)
                          })
                      })
                      .catch(err => {
                        logger.serverLog(TAG, `Error at: ${err}`)
                        sendErrorResponse(res, 500, err)
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
                    sendErrorResponse(res, 500, err)
                  })
              })
              .catch(err => {
                logger.serverLog(TAG, `Error at: ${err}`)
                sendErrorResponse(res, 500, err)
              })
          })
          .catch(err => {
            logger.serverLog(TAG, `Error at: ${err}`)
            sendErrorResponse(res, 500, err)
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
  let company
  let planUsage

  InviteAgentTokenDataLayer.findOneCompanyUserObjectUsingQuery({token: req.body.token})
    .then(token => {
      invitationToken = token
      if (!invitationToken) {
        sendErrorResponse(res, 404, 'Invitation token invalid or expired. Please contact admin to invite you again.')
      }
      return CompanyProfileDataLayer.findOneCPWithPlanPop({_id: invitationToken.companyId})
    })
    .then(companyFound => {
      company = companyFound
      return FeatureUsageDataLayer.findAllPlanUsageObjects({planId: company.planId})
    })
    .then(planUsageFound => {
      planUsage = planUsageFound[0]
      return FeatureUsageDataLayer.findAllCompanyUsageObjects({companyId: company._id})
    })
    .then(companyUsage => {
      companyUsage = companyUsage[0]
      if (planUsage.members !== -1 && companyUsage.members >= planUsage.members) {
        throw new Error('Members limit has been reached for this company. Please talk to company buyer/admin and ask them to upgrade their plan to let new members join.')
      } else {
        return CompanyUserDataLayer
          .findOneCompanyUserObjectUsingQueryPoppulate({companyId: invitationToken.companyId, role: 'buyer'})
      }
    })
    .then(compUser => {
      logger.serverLog(TAG, `Found Company User : ${util.inspect(compUser)}`)
      companyUser = compUser
      return dataLayer.findOneUserObject(compUser.userId)
    })
    .then(foundUser => {
      if (!companyUser || !foundUser) {
        sendErrorResponse(res, 404, '', 'user or company user not found')
      } else {
        logger.serverLog(TAG, `foundUser : ${util.inspect(foundUser)}`)
        console.log('foundUser.platform', foundUser.platform)
        let accountData = {
          name: req.body.name,
          email: req.body.email,
          domain: invitationToken.domain,
          password: req.body.password,
          domain_email: invitationToken.domain + '' + req.body.email,
          accountType: 'team',
          role: invitationToken.role,
          uiMode: foundUser.uiMode,
          platform: foundUser.platform
        }
        return dataLayer.createUserObject(accountData)
      }
    })
    .then(createdUser => {
      user = createdUser
      updateCompanyUsage(invitationToken.companyId, 'members', 1)
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
      logger.serverLog(TAG, `Created Company User : ${util.inspect(companyUserSaved)}`)
      return PermissionDataLayer.findOneRolePermissionObject(invitationToken.role)
    })
    .then(rolePermissions => {
      console.log('role Permission', rolePermissions)
      let roleBasedPermissions = Object.assign({}, rolePermissions)
      delete roleBasedPermissions._id
      delete roleBasedPermissions.__v
      delete roleBasedPermissions.role
      let permissionsPayload = _.merge({ companyId: invitationToken.companyId, userId: user._id }, roleBasedPermissions)
      console.log('After Permission', permissionsPayload)
      return PermissionDataLayer.createUserPermission(permissionsPayload)
    })
    .then(createdPermissions => {
      console.log('createdPermissions', createdPermissions)
      permissionSaved = createdPermissions
      logger.serverLog(TAG, `Created Permissions: ${util.inspect(permissionSaved)}`)

      let token = auth.signToken(user._id)
      res.clearCookie('email')
      res.clearCookie('companyId')
      res.clearCookie('companyName')
      res.clearCookie('domain')
      res.clearCookie('name')
      res.cookie('token', token)
      res.cookie('userid', user._id)
      sendSuccessResponse(res, 201, token)

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
      console.log('error', util.inspect(err))
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : sendErrorResponse(res, 400, 'ID is not provided')

  let name = req.body.name ? req.body.name : false
  let email = req.body.email ? req.body.email : false
  let uiMode = req.body.uiMode ? req.body.uiMode : false

  let payload = logicLayer.prepareUpdateUserPayload(name, email, uiMode)
  if (Object.keys(payload).length > 0) {
    dataLayer.updateUserObject(id, payload)
      .then(result => {
        sendSuccessResponse(res, 200, result)
      })
      .catch(err => {
        logger.serverLog(TAG, `Error at update user ${util.inspect(err)}`)
        sendErrorResponse(res, 500, err)
      })
  } else {
    logger.serverLog(TAG, `No field provided to update`)
    sendErrorResponse(res, 400, 'Provide field to update')
  }
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : sendErrorResponse(res, 500, '', 'ID is not provided')

  dataLayer.deleteUserObject(id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.authenticatePassword = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete user controller authenticatePassword')

  dataLayer.findOneUserByEmail(req.body)
    .then(user => {
      if (!user) return res.status(404).json({status: 'failed', description: 'User Not Found'})
      if (!user.authenticate(req.body.password)) {
        sendErrorResponse(res, 500, 'Incorrect password')
      } else {
        sendSuccessResponse(res, 200, '', 'Authenticated')
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at authenticatePassword user ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.addAccountType = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete user controller addAccountType')

  dataLayer.findAllUserObjects()
    .then(users => {
      users.forEach((user, index) => {
        CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({domain_email: user.domain_email})
          .then(companyUser => {
            logger.serverLog(TAG, `Found Company User: ${companyUser}`)
            return CompanyProfileDataLayer.findOneCPWithPlanPop({_id: companyUser.companyId}, true, 'planId')
          })
          .then(cp => {
            logger.serverLog(TAG, `Found Company Profile: ${cp}`)
            if (cp.planId.unique_ID === 'plan_A' || cp.planId.unique_ID === 'plan_B') {
              user.accountType = 'individual'
            } else if (cp.planId.unique_ID === 'plan_C' || cp.planId.unique_ID === 'plan_D') {
              user.accountType = 'team'
            }
            return dataLayer.saveUserObject(user)
          })
          .then(savedUser => {
            logger.serverLog(TAG, `saved User: ${savedUser}`)
          })
          .catch(err => {
            logger.serverLog(TAG, `Error at company addAccountType: ${util.inspect(err)}`)
            sendErrorResponse(res, 500, err)
          })
        if (index === (users.length - 1)) {
          sendSuccessResponse(res, 200, 'Successfuly added!')
        }
      })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at addAccountType: ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.enableDelete = function (req, res) {
  let deleteInformation = {delete_option: req.body.delete_option, deletion_date: req.body.deletion_date}
  dataLayer.updateUserObject(req.user._id, deleteInformation, {new: true})
    .then(updatedUser => {
      let deletionDate = moment(req.body.deletion_date).format('dddd, MMMM Do YYYY')
      let emailText = logicLayer.getEnableDeleteEmailText(req.body, deletionDate)
      // let sendgrid = utility.getSendGridObject()
      let sendgrid = require('sendgrid')(config.sendgrid.username, config.sendgrid.password)
      let email = new sendgrid.Email({
        to: req.user.email,
        from: 'support@cloudkibo.com',
        subject: 'KiboPush: Delete Confirmation',
        text: ' Delete Confirmation'
      })
      email = logicLayer.setEnableDeleteEmailBody(email, emailText)
      logger.serverLog(TAG, `email in user_controller${JSON.stringify(email)}`)
      sendgrid.send(email, function (err, json) {
        if (err) {
          return logger.serverLog(TAG,
            `Internal Server Error on sending email : ${JSON.stringify(
              err)}`)
        }
      })
      let emailAdmin = new sendgrid.Email({
        to: 'sojharo@cloudkibo.com',
        from: 'support@cloudkibo.com',
        subject: 'KiboPush: Delete User Information',
        text: 'Delete User Information',
        cc: 'jekram@cloudkibo.com'
      })
      logicLayer.setInhouseEnableDeleteEmailBody(emailAdmin, req.user, req.body, deletionDate)
      sendgrid.send(emailAdmin, function (err, json) {
        if (err) {
          return logger.serverLog(TAG,
            `Internal Server Error on sending email to Admin : ${JSON.stringify(
              err)}`)
        }
      })
      sendSuccessResponse(res, 200, updatedUser)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at enabling GDPR delete ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.cancelDeletion = function (req, res) {
  logger.serverLog(TAG, 'Disabling GDPR Delete')

  let deleteInformation = {delete_option: 'NONE', deletion_date: ''}
  dataLayer.updateUserObject(req.user._id, {deleteInformation}, {new: true})
    .then(updatedUser => {
      // let sendgrid = utility.getSendGridObject()
      let sendgrid = require('sendgrid')(config.sendgrid.username, config.sendgrid.password)
      let email = new sendgrid.Email({
        to: req.user.email,
        from: 'support@cloudkibo.com',
        subject: 'KiboPush: Delete Confirmation',
        text: ' Delete Confirmation'
      })
      let emailText = '<p> You have requested to cancel the deletion process. Request has been sent to admin.</p>'
      email = logicLayer.setEnableDeleteEmailBody(email, emailText)
      sendgrid.send(email, function (err, json) {
        if (err) {
          return logger.serverLog(TAG,
            `Internal Server Error on sending email : ${JSON.stringify(
              err)}`)
        }
      })
      let emailAdmin = new sendgrid.Email({
        to: 'sojharo@cloudkibo.com',
        from: 'support@cloudkibo.com',
        subject: 'KiboPush: Cancel Deletion Process',
        text: 'Cancel Deletion Process',
        cc: 'jekram@cloudkibo.com'
      })
      emailAdmin = logicLayer.setInhouseCancelDeleteEmailBody(emailAdmin, req.user)
      sendgrid.send(emailAdmin, function (err, json) {
        if (err) {
          return logger.serverLog(TAG,
            `Internal Server Error on sending email to Admin : ${JSON.stringify(
              err)}`)
        }
      })
      sendSuccessResponse(res, 200, updatedUser)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at enabling GDPR delete ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdateUserObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.fetchGeneral = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.findAllUserObjectsUsingQuery(req.body)
    .then(users => {
      sendSuccessResponse(res, 200, users)
    })
    .catch(err => {
      logger.serverLog(TAG, `fetch general endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.updatePicture = function (req, res) {
  let userFbId = req.body.user.facebookInfo.fbId
  let userFbToken = req.body.user.facebookInfo.fbToken
  logger.serverLog(TAG, `https://graph.facebook.com/v6.0/${userFbId}/picture`)
  needle.get(
    `https://graph.facebook.com/v3.2/${userFbId}?access_token=${userFbToken}&fields=picture`,
    (err, resp) => {
      if (err) {
        logger.serverLog(TAG, `error in retrieving https://graph.facebook.com/v6.0/${userFbId}/picture ${JSON.stringify(err)}`)
      }
      if (resp.body.picture && resp.body.picture.data && resp.body.picture.data.url) {
        dataLayer.genericUpdateUserObject({_id: req.body.user._id}, {'facebookInfo.profilePic': resp.body.picture.data.url}, {})
          .then(updated => {
            logger.serverLog(TAG, `Succesfully updated user's profile picture ${req.body.user._id}`)
            sendSuccessResponse(res, 200, resp.body.picture.data.url)
          })
          .catch(err => {
            logger.serverLog(TAG, `Failed to update user ${JSON.stringify(err)}`)
            sendErrorResponse(res, 500, err)
          })
      } else {
        sendErrorResponse(res, 500, `profile picture not found for user with _id ${req.body.user._id}`)
      }
    })
}
exports.aggregate = function (req, res) {
  logger.serverLog(TAG, `Hit the aggregate endpoint for subscriber controller: ${util.inspect(req.body)}`)
  let query = logicLayer.validateAndConvert(req.body)
  logger.serverLog(TAG, `after conversion query ${util.inspect(query)}`)
  //   logger.serverLog(TAG, `after conversion query ${util.inspect(query[0].$match.datetime)}`)
  //   logger.serverLog(TAG, `after conversion query ${util.inspect(query[0].$match.pageId)}`)
  dataLayer.aggregateInfo(query)
    .then(result => {
      logger.serverLog(TAG, `aggregate endpoint for subscriber found result ${util.inspect(result)}`)
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}
exports.distinct = function (req, res) {
  dataLayer.distinctQuery(req.body.distinct)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.markAccountAsDisabled = (req, res) => {
  console.log(req.body)
  dataLayer.genericUpdateUserObject({email: {$in: req.body.emails}},
    {$set: {disableMember: true}},
    {multi: true})
    .then(data => {
      console.log(data)
      sendSuccessResponse(res, 200, req.body)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

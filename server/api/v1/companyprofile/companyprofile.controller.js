const logger = require('../../../components/logger')
const utility = require('./../../../components/utility')
const logicLayer = require('./companyprofile.logiclayer')
const dataLayer = require('./companyprofile.datalayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const InvitationDataLayer = require('./../invitations/invitations.datalayer')
const InviteAgentTokenDataLayer = require('./../inviteagenttoken/inviteagenttoken.datalayer')
const UserDataLayer = require('./../user/user.datalayer')
const PermissionDataLayer = require('./../permissions/permissions.datalayer')
const PlanDataLayer = require('./../plans/plans.datalayer')
const UserLogicLayer = require('./../user/user.logiclayer')
const CompanyUsageModel = require('./../featureUsage/companyUsage.model')
const PlanUsageModel = require('./../featureUsage/planUsage.model')
const PagesModel = require('./../pages/Pages.model')
const config = require('./../../../config/environment/index')
const TAG = '/api/v1/companyprofile/companyprofile.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')
const async = require('async')

/*
......Review Comments.....

--> we should populate companyprofile in companyUser. That way we won't need endpoint
    to fetch companyprofile
--> update plan validation should be handled on KiboChat and KiboEngage =>
      update plan is not being called from KiboEngage and KiboChat

*/

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find controller index')

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        sendErrorResponse(res, 404, '', 'The user account does not belong to any company. Please contact support')
      }
      dataLayer
        .findOneCPWithPlanPop({_id: companyUser.companyId})
        .then(companyProfile => {
          sendSuccessResponse(res, 200, companyProfile)
        })
        .catch(err => {
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.setCard = function (req, res) {
  logger.serverLog(TAG, 'Hit the setCard controller index')

  dataLayer.findOneCPWithPlanPop({_id: req.body.companyId})
    .then(profile => {
      if (!profile) { sendErrorResponse(res, 404, '', 'Company not found') }
      logicLayer.setCard(profile, req.body.stripeToken)
        .then(result => {
          console.log(result)
          if (result.status === 'failed') sendErrorResponse(res, 500, '', result.description)
          else if (result.status === 'success') sendSuccessResponse(res, 200, '', result.description)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in set Card ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.switchToBasicPlan = function (req, res) {
  PlanDataLayer.findOnePlanObjectUsingQuery({unique_ID: 'plan_A'})
    .then(plan => {
      async.parallelLimit([
        function (cb) {
          dataLayer.findOneProfileAndUpdate({_id: req.user.companyId}, {planId: plan._id, 'trialPeriod.status': false}, {})
            .then(updatedProfile => cb(null, updatedProfile))
            .catch(err => cb(err))
        },
        function (cb) {
          PlanUsageModel.findOne({planId: plan._id}).exec()
            .then(planUsage => cb(null, planUsage))
            .catch(err => cb(err))
        },
        function (cb) {
          CompanyUsageModel.findOne({companyId: req.user.companyId}).exec()
            .then(companyUsage => cb(null, companyUsage))
            .catch(err => cb(err))
        }
      ], 10, function (err, result) {
        if (err) {
          sendErrorResponse(res, 500, err)
        } else {
          const updatedProfile = result[0]
          const planUsage = result[1]
          const companyUsage = result[2]
          if (companyUsage['facebook_pages'] > planUsage['facebook_pages']) {
            PagesModel.update({companyId: req.user.companyId}, {connected: false}, {multi: true}).exec()
              .then(updated => {
                return CompanyUsageModel.update({companyId: req.user.companyId}, {facebook_pages: 0}).exec()
              })
              .then(updated => {
                sendSuccessResponse(res, 200, updatedProfile)
              })
              .catch(err => {
                sendErrorResponse(res, 500, err)
              })
          } else {
            sendSuccessResponse(res, 200, updatedProfile)
          }
        }
      })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in fetch plan ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

const _updateCompanyPlan = (data, callback) => {
  const query = {_id: data.companyId}
  const update = {planId: data.planObject._id, 'stripe.plan': data.plan}
  dataLayer.genericUpdatePostObject(query, update, {})
    .then(result => callback())
    .catch(err => callback(err))
}

const _updateStripePlan = (data, callback) => {
  dataLayer.findOneCPWithPlanPop({_id: data.companyId})
    .then(company => {
      if (!company) callback(new Error('Company not found'))
      logicLayer.setPlan(company, data.stripeToken, data.plan)
        .then(result => {
          console.log(result)
          if (result.status === 'failed') callback(result)
          else if (result.status === 'success') callback()
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in update plan ${util.inspect(err)}`)
      callback(err)
    })
}

exports.updatePlan = function (req, res) {
  logger.serverLog(TAG, 'Hit the updatePlan controller index')
  if (req.user.plan.unique_ID === req.body.plan) {
    sendErrorResponse(res, 500, `The selected plan is the same as the current plan.`)
  }
  if (req.body.plan !== 'plan_A' && !req.user.last4) {
    sendErrorResponse(res, 500, `Please add a card to your account before choosing a plan.`)
  }
  PlanDataLayer.findOnePlanObjectUsingQuery({unique_ID: req.body.plan})
    .then(planObject => {
      const data = {...req.body, planObject}
      async.parallelLimit([
        function (cb) {
          PlanUsageModel.findOne({planId: planObject._id}).exec()
            .then(planUsage => cb(null, planUsage))
            .catch(err => cb(err))
        },
        function (cb) {
          CompanyUsageModel.findOne({companyId: req.user.companyId}).exec()
            .then(companyUsage => cb(null, companyUsage))
            .catch(err => cb(err))
        },
        _updateCompanyPlan.bind(null, data),
        _updateStripePlan.bind(null, data)
      ], 10, function (err, result) {
        if (err) {
          sendErrorResponse(res, 500, err.description)
        } else {
          const planUsage = result[0]
          const companyUsage = result[1]
          if (companyUsage['facebook_pages'] > planUsage['facebook_pages']) {
            PagesModel.update({companyId: req.user.companyId}, {connected: false}, {multi: true}).exec()
              .then(updated => {
                return CompanyUsageModel.update({companyId: req.user.companyId}, {facebook_pages: 0}).exec()
              })
              .then(updated => {
                sendSuccessResponse(res, 200, '', 'Plan updated successfully!')
              })
              .catch(err => {
                sendErrorResponse(res, 500, err)
              })
          } else {
            sendSuccessResponse(res, 200, '', 'Plan updated successfully!')
          }
        }
      })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in update plan ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.invite = function (req, res) {
  logger.serverLog(TAG, 'Hit the invite controller index')
  let companyUserQuery = {domain_email: req.user.domain_email, populate: 'companyId'}

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate(companyUserQuery)
    .then(companyUser => {
      companyUser
        ? logger.serverLog(TAG, `Company User found: ${util.inspect(companyUser)}`)
        : sendErrorResponse(res, 404, '', 'The user account logged in does not belong to any company. Please contact support')

      // Query Objects
      let InvitationCountQuery = {email: req.body.email, companyId: companyUser.companyId._id}
      let UserCountQuery = {email: req.body.email}
      let UserDomainCount = {email: req.body.email, domain: req.user.domain}
      // Promise Objects
      let InvitationCountPromise = InvitationDataLayer
        .CountInvitationObjectUsingQuery(InvitationCountQuery)
      let UserEmailCountPromise = UserDataLayer
        .CountUserObjectUsingQuery(UserCountQuery)
      let UserDomainCountPromise = UserDataLayer
        .CountUserObjectUsingQuery(UserDomainCount)

      Promise.all([InvitationCountPromise, UserEmailCountPromise, UserDomainCountPromise])
        .then(results => {
          // Resolved Results
          logger.serverLog(TAG, `${results} is already invited.`)
          let gotCount = results[0] ? results[0] : null
          let gotCountAgentWithEmail = results[1] ? results[1] : null
          let gotCountAgent = results[2] ? results[2] : null
          if (gotCount > 0) {
            logger.serverLog(TAG, `${req.body.name} is already invited.`)
            sendErrorResponse(res, 400, `${req.body.name} is already invited.`)
          } else if (gotCountAgentWithEmail > 0) {
            logger.serverLog(TAG, `${req.body.name} is already on KiboPush.`)
            sendErrorResponse(res, 400, `${req.body.name} is already on KiboPush.`)
          } else if (gotCountAgent > 0) {
            logger.serverLog(TAG, `${req.body.name} is already a member.`)
            sendErrorResponse(res, 400, `${req.body.name} is already a member.`)
          } else {
            let uniqueTokenId = UserLogicLayer.getRandomString()
            let getTokenPayload = {
              email: req.body.email,
              token: uniqueTokenId,
              companyId: companyUser.companyId._id,
              domain: req.user.domain,
              companyName: companyUser.companyId.companyName,
              role: req.body.role
            }
            let invitationPayload = {
              name: req.body.name,
              email: req.body.email,
              companyId: companyUser.companyId._id
            }
            let invitetokenPromise = InviteAgentTokenDataLayer
              .createInvitationTokenObject(getTokenPayload)
            let inviteTempDataPro = InvitationDataLayer
              .createInvitationObject(invitationPayload)

            Promise.all([invitetokenPromise, inviteTempDataPro])
              .then(result => {
                let sendgrid = utility.getSendGridObject()

                let emailParam = new sendgrid.Email(logicLayer.getEmailParameters(req.body.email))
                emailParam = logicLayer.setEmailBody(emailParam, req.user, companyUser, uniqueTokenId, req.body.role)
                sendgrid.send(emailParam, (err, json) => {
                  console.log('error from sendgrid', err)
                  console.log('response from sendgrid', json)
                  logger.serverLog(TAG, `response from sendgrid send: ${JSON.stringify(json)}`)
                  err
                    ? logger.serverLog(TAG, `error at sendgrid send ${JSON.stringify(err)}`)
                    : logger.serverLog(TAG, `response from sendgrid send: ${JSON.stringify(json)}`)

                  json
                    ? sendSuccessResponse(res, 200, 'Email has been sent')
                    : sendErrorResponse(res, 500, err)
                })
              })
              .catch(err => {
                logger.serverLog(TAG, `At invite token save ${err}`)
              })
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Error in getting companies count ${util.inspect(err)}`)
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting companies count ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.updateRole = function (req, res) {
  logger.serverLog(TAG, 'Hit the updateRole controller index')

  if (config.userRoles.indexOf(req.user.role) > 1) {
    sendErrorResponse(res, 401, '', 'Unauthorised to perform this action.')
  }

  if (config.userRoles.indexOf(req.body.role) < 0) {
    sendErrorResponse(res, 404, '', 'Invalid role')
  }

  let query = {domain_email: req.body.domain_email}

  let promiseCompanyUser = CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate(query)
  let promiseUser = UserDataLayer
    .findOneUserObjectUsingQuery(query)
  Promise.all([promiseUser, promiseCompanyUser])
    .then(resultArray => {
      let user = resultArray[0]
      let companyUser = resultArray[1]

      user.role = req.body.role
      companyUser.role = req.body.role

      promiseUser = UserDataLayer.saveUserObject(user)
      promiseCompanyUser = CompanyUserDataLayer.updateOneCompanyUserObjectUsingQuery({_id: companyUser._id}, {role: req.body.role}, {})
      let permissionPromise = PermissionDataLayer
        .updatUserPermissionsObjectUsingQuery({userId: user._id}, config.permissions[req.body.role], {multi: true})

      Promise.all([promiseUser, promiseCompanyUser, permissionPromise])
        .then(result => {
          sendSuccessResponse(res, 200, {savedUser: result[0], savedUserCompany: result[1]})
        })
        .catch(err => {
          logger.serverLog(TAG, `Error in getting promise all update role ${util.inspect(err)}`)
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting promise all update role ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.removeMember = function (req, res) {
  logger.serverLog(TAG, 'Hit the removeMember controller index')
  if (config.userRoles.indexOf(req.user.role) > 1) {
    sendErrorResponse(res, 401, '', 'Unauthorised to perform this action.')
  }
  if (config.userRoles.indexOf(req.body.role) < 0) {
    sendErrorResponse(res, 404, '', 'Invalid role')
  }

  let query = {domain_email: req.body.domain_email}
  let companyUserRemove = CompanyUserDataLayer.removeOneCompanyUserObjectUsingQuery(query)
  let userRemove = UserDataLayer.deleteUserObjectUsingQuery(query)

  Promise.all([companyUserRemove, userRemove])
    .then(result => {
      sendSuccessResponse(res, 200, '', 'Account removed')
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting promise all remove member ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.members = function (req, res) {
  logger.serverLog(TAG, 'Hit the members controller index')

  let query = {domain_email: req.user.domain_email}
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate(query)
    .then(companyUser => {
      CompanyUserDataLayer
        .findAllCompanyUserObjectUsingQuery({companyId: companyUser.companyId})
        .then(members => {
          sendSuccessResponse(res, 200, members)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting company User members ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.updateAutomatedOptions = function (req, res) {
  logger.serverLog(TAG, 'Hit the updatedautomated options controller index')

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        sendErrorResponse(res, 404, '', 'The user account does not belong to any company. Please contact support')
      }
      let query = {_id: companyUser.companyId}
      let update = {automated_options: req.body.automated_options}
      let options = {new: true} // Returns updated doc
      dataLayer
        .findOneProfileAndUpdate(query, update, options)
        .then(updatedProfile => {
          sendSuccessResponse(res, 200, updatedProfile)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Internal Server Error ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.getAutomatedOptions = function (req, res) {
  logger.serverLog(TAG, 'Hit the getAutomatedOptions controller index')

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        sendErrorResponse(res, 404, '', 'The user account does not belong to any company. Please contact support')
      }

      dataLayer
        .findOneCPWithPlanPop({_id: companyUser.companyId})
        .then(company => {
          sendSuccessResponse(res, 200, company)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Internal Server Error ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findOneCPWithPlanPop(req.body, true, 'planId')
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findPostObjectUsingAggregate(logicLayer.validateAndConvert(req.body))
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePostObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.getKeys = function (req, res) {
  sendSuccessResponse(res, 200, {captchaKey: config.captchaKey, stripeKey: config.stripeOptions.stripePubKey})
}

exports.charge = function (req, res) {
  logger.serverLog(TAG, 'Hit the company profile controller charge')
  dataLayer.findOneCPWithPlanPop({_id: req.body.companyId})
    .then(profile => {
      if (!profile) {
        sendErrorResponse(res, 404, '', 'Company not found')
      } else {
        profile.chargeCustomer({
          amount: parseInt(req.body.amount),
          currency: req.body.currency,
          description: req.body.description
        }, function (err, response) {
          if (err) {
            sendErrorResponse(res, 500, null, err)
          } else {
            sendSuccessResponse(res, 200, 'Company has been charged successfully!')
          }
        })
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in charge company ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

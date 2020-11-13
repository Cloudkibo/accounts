const logger = require('../../../components/logger')
const utility = require('./../../../components/utility')
const logicLayer = require('./companyprofile.logiclayer')
const dataLayer = require('./companyprofile.datalayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const InvitationDataLayer = require('./../invitations/invitations.datalayer')
const InviteAgentTokenDataLayer = require('./../inviteagenttoken/inviteagenttoken.datalayer')
const UserDataLayer = require('./../user/user.datalayer')
const SubscribersDataLayer = require('./../subscribers/subscribers.datalayer')
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
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        const message = 'The user account does not belong to any company'
        logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')    
        sendErrorResponse(res, 404, '', 'The user account does not belong to any company. Please contact support')
      }
      dataLayer
        .findOneCPWithPlanPop({_id: companyUser.companyId})
        .then(companyProfile => {
          sendSuccessResponse(res, 200, companyProfile)
        })
        .catch(err => {
          const message = err || 'Failed to find CPWithPlanPop'
          logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')    
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to find company user'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.setCard = function (req, res) {
  dataLayer.findOneCPWithPlanPop({_id: req.body.companyId})
    .then(profile => {
      if (!profile) { 
        const message = 'Company not found'
        logger.serverLog(message, `${TAG}: exports.setCard`, req.body, {user: req.user}, 'error')    
        sendErrorResponse(res, 404, '', 'Company not found') 
      }
      logicLayer.setCard(profile, req.body.stripeToken)
        .then(result => {
          console.log(result)
          if (result.status === 'failed') {
            const message = 'Error in set Card'
            logger.serverLog(message, `${TAG}: exports.setCard`, req.body, {user: req.user}, 'error')
            sendErrorResponse(res, 500, '', result.description)
          }
          else if (result.status === 'success') sendSuccessResponse(res, 200, '', result.description)
        })
    })
    .catch(err => {
      const message = err || 'Error in set Card'
      logger.serverLog(message, `${TAG}: exports.setCard`, req.body, {user: req.user}, 'error')
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
          const message = err || 'Error in Parallel Limit'
          logger.serverLog(message, `${TAG}: exports.setCard`, req.body, {user: req.user}, 'error')    
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
                const message = err || 'Error in page Update'
                logger.serverLog(message, `${TAG}: exports.setCard`, req.body, {user: req.user}, 'error')          
                sendErrorResponse(res, 500, err)
              })
          } else {
            sendSuccessResponse(res, 200, updatedProfile)
          }
        }
      })
    })
    .catch(err => {
      const message = err || 'Error in find plan'
      logger.serverLog(message, `${TAG}: exports.setCard`, req.body, {user: req.user}, 'error')          
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
            .catch(err => {
              cb(err)
            })
        },
        function (cb) {
          CompanyUsageModel.findOne({companyId: req.user.companyId}).exec()
            .then(companyUsage => cb(null, companyUsage))
            .catch(err => {
              cb(err)
            }) 
        },
        _updateCompanyPlan.bind(null, data),
        _updateStripePlan.bind(null, data)
      ], 10, function (err, result) {
        if (err) {
          logger.serverLog(err.description, `${TAG}: exports.updatePlan`, req.body, {user: req.user}, 'error')
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
                logger.serverLog(result.description, `${TAG}: exports.updatePlan`, req.body, {user: req.user}, 'error')
                sendErrorResponse(res, 500, err)
              })
          } else {
            sendSuccessResponse(res, 200, '', 'Plan updated successfully!')
          }
        }
      })
    })
    .catch(err => {
      const message = err || 'Error in update plan'
      logger.serverLog(message, `${TAG}: exports.updatePlan`, req.body, {user: req.user}, 'error')    
      sendErrorResponse(res, 500, err)
    })
}

exports.invite = function (req, res) {
  let companyUserQuery = {domain_email: req.user.domain_email, populate: 'companyId'}

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate(companyUserQuery)
    .then(companyUser => {
      if (companyUser) logger.serverLog(TAG, `Company User found: ${util.inspect(companyUser)}`)
      else {
        logger.serverLog('The user account logged in does not belong to any company. Please contact support', `${TAG}: exports.updatePlan`, req.body, {user: req.user}, 'error')              
        sendErrorResponse(res, 404, '', 'The user account logged in does not belong to any company. Please contact support')
      }
      // Query Objects
      let InvitationCountQuery = {email: {$regex: `^${req.body.email}$`, $options: 'i'}, companyId: companyUser.companyId._id}
      let UserCountQuery = {email: {$regex: `^${req.body.email}$`, $options: 'i'}}
      let UserDomainCount = {email: {$regex: `^${req.body.email}$`, $options: 'i'}, domain: req.user.domain}
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
          let gotCount = results[0] ? results[0] : null
          let gotCountAgentWithEmail = results[1] ? results[1] : null
          let gotCountAgent = results[2] ? results[2] : null
          if (gotCount > 0) {
            logger.serverLog(`${req.body.name} is already invited.`, `${TAG}: exports.updatePlan`, req.body, {user: req.user}, 'error')
            sendErrorResponse(res, 400, `${req.body.name} is already invited.`)
          } else if (gotCountAgent > 0) {
            logger.serverLog(`${req.body.name} is already a memeber.`, `${TAG}: exports.updatePlan`, req.body, {user: req.user}, 'error')
            sendErrorResponse(res, 400, `${req.body.name} is already a member.`)
          } else if (gotCountAgentWithEmail > 0) {
            logger.serverLog(`${req.body.name} is already on KiboPush.`, `${TAG}: exports.updatePlan`, req.body, {user: req.user}, 'error')
            sendErrorResponse(res, 400, `${req.body.name} is already on KiboPush.`)
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
                  logger.serverLog(TAG, `response from sendgrid send: ${JSON.stringify(json)}`)
                  err
                    ? logger.serverLog(`error at sendgrid send ${(err)}`, `${TAG}: exports.invite`, req.body, {user: req.user}, 'error')
                    : logger.serverLog(`response from sendgrid send: ${JSON.stringify(json)}`, TAG)

                  if (json) sendSuccessResponse(res, 200, 'Email has been sent')
                  else {
                    logger.serverLog(res, `${TAG}: exports.updatePlan`, req.body, {user: req.user}, 'error')
                    sendErrorResponse(res, 500, err)
                  }
                })
              })
              .catch(err => {
                const message = err || 'Failed to invite token save'
                logger.serverLog(message, `${TAG}: exports.invite`, req.body, {user: req.user}, 'error')          
              })
          }
        })
        .catch(err => {
          const message = err || 'Error in getting companies count'
          logger.serverLog(message, `${TAG}: exports.invite`, req.body, {user: req.user}, 'error')          
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Error in getting companies count'
      logger.serverLog(message, `${TAG}: exports.invite`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.updateRole = function (req, res) {
  if (config.userRoles.indexOf(req.user.role) > 1) {
    logger.serverLog('Unauthorised to perform this action.', `${TAG}: exports.updateRole`, req.body, {user: req.user}, 'error')
    sendErrorResponse(res, 401, '', 'Unauthorised to perform this action.')
  }

  if (config.userRoles.indexOf(req.body.role) < 0) {
    logger.serverLog('Invalid role', `${TAG}: exports.updateRole`, req.body, {user: req.user}, 'error')
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
      promiseCompanyUser = CompanyUserDataLayer.updateOneCompanyUserObjectUsingQuery({_id: companyUser._id}, {role: req.body.role}, {user: req.user})
      let permissionPromise = PermissionDataLayer
        .updatUserPermissionsObjectUsingQuery({userId: user._id}, config.permissions[req.body.role], {multi: true})

      Promise.all([promiseUser, promiseCompanyUser, permissionPromise])
        .then(result => {
          sendSuccessResponse(res, 200, {savedUser: result[0], savedUserCompany: result[1]})
        })
        .catch(err => {
          const message = err || 'Error in getting promise all update role'
          logger.serverLog(message, `${TAG}: exports.updateRole`, req.body, {user: req.user}, 'error')  
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Error in getting promise all update role'
      logger.serverLog(message, `${TAG}: exports.updateRole`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.disableMember = function (req, res) {  
  let queryRemovingAssignment = {
    is_assigned: true,
    'assigned_to.type': 'agent',
    'assigned_to.id': req.body.memberId
  }
  
  let userDisabled = UserDataLayer.updateOneUserObjectUsingQuery({_id:req.body.memberId}, {disableMember: true}, {upsert: true})
  let removeAssignment = SubscribersDataLayer.genericUpdateSubscriberObject(queryRemovingAssignment, {is_assigned: false, assigned_to: null}, {multi: true})

  Promise.all([userDisabled, removeAssignment])
    .then(result => {
      sendSuccessResponse(res, 200, result, 'User has been disabled')
    })
    .catch(err => {
      const message = err || 'Error in getting promise all remove member'
      logger.serverLog(message, `${TAG}: exports.disableMember`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.members = function (req, res) {
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
      const message = err || 'Error in getting company User members'
      logger.serverLog(message, `${TAG}: exports.disableMember`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.updateAutomatedOptions = function (req, res) {
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        logger.serverLog('The user account does not belong to any company. Please contact support', `${TAG}: exports.updateAutomatedOptions`, req.body, {user: req.user}, 'error')
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
      const message = err || 'Error in find company user'
      logger.serverLog(message, `${TAG}: exports.updateAutomatedOptions`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.getAutomatedOptions = function (req, res) {
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        logger.serverLog('The user account does not belong to any company. Please contact support', `${TAG}: exports.getAutomatedOptions`, req.body, {user: req.user}, 'error')
        sendErrorResponse(res, 404, '', 'The user account does not belong to any company. Please contact support')
      }

      dataLayer
        .findOneCPWithPlanPop({_id: companyUser.companyId})
        .then(company => {
          sendSuccessResponse(res, 200, company)
        })
    })
    .catch(err => {
      const message = err || 'Error in find company user'
      logger.serverLog(message, `${TAG}: exports.getAutomatedOptions`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFetch = function (req, res) {
  dataLayer
    .findOneCPWithPlanPop(req.body, true, 'planId')
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Error in find Plan'
      logger.serverLog(message, `${TAG}: exports.genericFetch`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateFetch = function (req, res) {
  dataLayer
    .findPostObjectUsingAggregate(logicLayer.validateAndConvert(req.body))
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Error in find Plan'
      logger.serverLog(message, `${TAG}: exports.aggregateFetch`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {

  dataLayer.genericUpdatePostObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Error in update'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.getKeys = function (req, res) {
  sendSuccessResponse(res, 200, {captchaKey: config.captchaKey, stripeKey: config.stripeOptions.stripePubKey})
}

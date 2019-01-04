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
const config = require('./../../../config/environment/index')
const TAG = '/api/v1/companyprofile/companyprofile.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find controller index')

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQuery({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }
      dataLayer
        .findOneCompanyProfileObject(companyUser.companyId)
        .then(companyProfile => {
          return res.status(200).json({status: 'success', payload: companyProfile})
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.addPlanID = function (req, res) {
  logger.serverLog(TAG, 'Hit the addPlanID controller index')
  dataLayer
    .findAllProfileObjectsUsingQuery({})
    .then(companies => {
      companies.forEach((company, index) => {
        PlanDataLayer.findOnePlanObjectUsingQuery({unique_ID: company.stripe.plan})
          .then(plan => {
            company.planId = plan._id
            dataLayer.saveProfileObject(company)
              .then(result => {
                if (index === (companies.length - 1)) {
                  return res.status(200).json({
                    status: 'success',
                    description: 'Successfuly added!'
                  })
                }
              })
          })
          .catch(err => {
            logger.serverLog(TAG, `Error in plan addplanid ${util.inspect(err)}`)
            return res.status(500).json({status: 'failed', payload: err})
          })
      })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting companies count ${util.inspect(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.setCard = function (req, res) {
  logger.serverLog(TAG, 'Hit the setCard controller index')

  dataLayer.findOneCompanyProfileObject(req.body.companyId)
    .then(profile => {
      if (!profile) { return res.status(404).json({status: 'failed', description: 'Company not found'}) }
      // Instance Level Method. No Idea if it supports promise. so keeping original callback
      let result = logicLayer.setCard(profile, req.body.stripeToken)
      if (result.status === 'failed') res.status(500).json(result)
      else if (result.status === 'success') res.status(200).json(result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in set Card ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.updatePlan = function (req, res) {
  logger.serverLog(TAG, 'Hit the updatePlan controller index')
  if (req.user.plan.unique_ID === req.body.plan) {
    return res.status(500).json({
      status: 'failed',
      description: `The selected plan is the same as the current plan.`
    })
  }
  if (!req.user.last4 && !req.body.stripeToken) {
    return res.status(500).json({
      status: 'failed',
      description: `Please add a card to your account before choosing a plan.`
    })
  }
  PlanDataLayer.findOnePlanObjectUsingQuery({unique_ID: req.body.plan})
    .then(plan => {
      let query = {_id: req.body.companyId}
      let update = {planId: plan._id, 'stripe.plan': req.body.plan}
      dataLayer.genericUpdateCompanyProfileObject(query, update, {})
        .then(result => { logger.serverLog(TAG, `update: ${result}`) })
        .catch(err => { logger.serverLog(TAG, err) })

      dataLayer.findOneCompanyProfileObject(req.body.companyId)
        .then(company => {
          if (!company) return res.status(404).json({status: 'failed', description: 'Company not found'})

          let result = logicLayer.setPlan(company, req.body.stripeToken, plan)
          if (result.status === 'failed') res.status(500).json(result)
          else if (result.status === 'success') res.status(200).json(result)
        })
        .catch(err => {
          logger.serverLog(TAG, `Error in update plan ${util.inspect(err)}`)
          return res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in update plan ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.invite = function (req, res) {
  logger.serverLog(TAG, 'Hit the invite controller index')
  let companyUserQuery = {domain_email: req.user.domain_email}

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate(companyUserQuery)
    .then(companyUser => {
      companyUser
        ? logger.serverLog(TAG, `Company User found: ${util.inspect(companyUser)}`)
        : res.status(404).json({
          status: 'failed',
          payload: 'The user account logged in does not belong to any company. Please contact support'
        })

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
            res.status(400).json({
              status: 'failed',
              payload: `${req.body.name} is already invited.`
            })
          } else if (gotCountAgentWithEmail > 0) {
            logger.serverLog(TAG, `${req.body.name} is already on KiboPush.`)
            res.status(400).json({
              status: 'failed',
              payload: `${req.body.name} is already on KiboPush.`
            })
          } else if (gotCountAgent > 0) {
            logger.serverLog(TAG, `${req.body.name} is already a member.`)
            res.status(400).json({
              status: 'failed',
              payload: `${req.body.name} is already a member.`
            })
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
                let email = new sendgrid.Email(logicLayer.getEmailParameters(req.body.email))
                email = logicLayer.setEmailBody(email, req.user, companyUser, uniqueTokenId)
                sendgrid.send(email, (err, json) => {
                  logger.serverLog(TAG, `response from sendgrid send: ${JSON.stringify(json)}`)
                  err
                    ? logger.serverLog(TAG, `error at sendgrid send ${JSON.stringify(err)}`)
                    : logger.serverLog(TAG, `response from sendgrid send: ${JSON.stringify(json)}`)

                  json
                    ? res.status(200).json(
                      {status: 'success', payload: 'Email has been sent'})
                    : res.status(500).json({
                      status: 'failed',
                      payload: `Internal Server Error ${JSON.stringify(err)}`
                    })
                })
              })
              .catch(err => {
                logger.serverLog(TAG, `At invite token save ${err}`)
              })
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Error in getting companies count ${util.inspect(err)}`)
          return res.status(500).json({
            status: 'failed',
            payload: `Internal Server Error ${JSON.stringify(err)}`
          })
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting companies count ${util.inspect(err)}`)
      return res.status(500).json({
        status: 'failed',
        payload: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.updateRole = function (req, res) {
  logger.serverLog(TAG, 'Hit the updateRole controller index')

  if (config.userRoles.indexOf(req.user.role) > 1) {
    return res.status(401).json(
      {status: 'failed', description: 'Unauthorised to perform this action.'})
  }

  if (config.userRoles.indexOf(req.body.role) < 0) {
    return res.status(404)
      .json({status: 'failed', description: 'Invalid role.'})
  }

  let query = {domain_email: req.body.domain_email}

  let promiseCompanyUser = CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQuery(query)
  let promiseUser = UserDataLayer
    .findOneUserObjectUsingQuery(query)
  Promise.all([promiseUser, promiseCompanyUser])
    .then(resultArray => {
      let user = resultArray[0]
      let companyUser = resultArray[1]

      user.role = req.body.role
      companyUser.role = req.body.role

      console.log('user.role', user.role)
      console.log(' companyUser.role', companyUser.role)



      promiseUser = UserDataLayer.saveUserObject(user)
      promiseCompanyUser = CompanyUserDataLayer.saveCompanyUserObject(companyUser)
      let permissionPromise = PermissionDataLayer
        .updatUserPermissionsObjectUsingQuery({userId: user._id}, config.permissions[req.body.role], {multi: true})

      Promise.all([promiseUser, promiseCompanyUser, permissionPromise])
        .then(result => {
          return res.status(200)
            .json({status: 'success', payload: {savedUser: result[0], savedUserCompany: result[1]}})
        })
        .catch(err => {
          logger.serverLog(TAG, `Error in getting promise all update role ${util.inspect(err)}`)
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting promise all update role ${util.inspect(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.removeMember = function (req, res) {
  logger.serverLog(TAG, 'Hit the removeMember controller index')
  if (config.userRoles.indexOf(req.user.role) > 1) {
    return res.status(401).json(
      {status: 'failed', description: 'Unauthorised to perform this action.'})
  }

  let query = {domain_email: req.body.domain_email}
  let companyUserRemove = CompanyUserDataLayer.removeOneCompanyUserObjectUsingQuery(query)
  let userRemove = UserDataLayer.deleteUserObjectUsingQuery(query)

  Promise.all([companyUserRemove, userRemove])
    .then(result => {
      return res.status(200).json({status: 'success', description: 'Account removed.'})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting promise all remove member ${util.inspect(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.members = function (req, res) {
  logger.serverLog(TAG, 'Hit the members controller index')

  let query = {domain_email: req.user.domain_email}
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQuery(query)
    .then(companyUser => {
      CompanyUserDataLayer
        .findAllCompanyUserObjectUsingQuery({companyId: companyUser.companyId})
        .then(members => {
          res.status(200).json({status: 'success', payload: members})
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error in getting company User members ${util.inspect(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.updateAutomatedOptions = function (req, res) {
  logger.serverLog(TAG, 'Hit the updatedautomated options controller index')

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQuery({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }
      let query = {_id: companyUser.companyId}
      let update = {automated_options: req.body.automated_options}
      let options = {new: true} // Returns updated doc
      dataLayer
        .findOneProfileAndUpdate(query, update, options)
        .then(updatedProfile => {
          res.status(200).json({status: 'success', payload: updatedProfile})
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Internal Server Error ${util.inspect(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.getAutomatedOptions = function (req, res) {
  logger.serverLog(TAG, 'Hit the getAutomatedOptions controller index')

  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQuery({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }

      dataLayer
        .findOneCompanyProfileObject(companyUser.companyId)
        .then(company => {
          res.status(200).json({status: 'success', payload: company})
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Internal Server Error ${util.inspect(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.genericFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findOneCPWithPlanPop(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.aggregateFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findPostObjectUsingAggregate(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePostObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.getKeys = function (req, res) {
  if (config.env === 'production') {
    res.status(200).json({status: 'success', captchaKey: '6Lf9kV4UAAAAALTke6FGn_KTXZdWPDorAQEKQbER', stripeKey: config.stripeOptions.stripePubKey})
  } else if (config.env === 'staging') {
    res.status(200).json({status: 'success', captchaKey: '6LdWsF0UAAAAAK4UFpMYmabq7HwQ6XV-lyWd7Li6', stripeKey: config.stripeOptions.stripePubKey})
  } else if (config.env === 'development') {
    res.status(200).json({status: 'success', captchaKey: '6LckQ14UAAAAAFH2D15YXxH9o9EQvYP3fRsL2YOU', stripeKey: config.stripeOptions.stripePubKey})
  }
}

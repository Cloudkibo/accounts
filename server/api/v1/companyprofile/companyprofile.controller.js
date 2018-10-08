const logger = require('../../../components/logger')
const utility = require('./../../../components/utility')
const logicLayer = require('./companyprofile.logiclayer')
const dataLayer = require('./companyprofile.datalayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const InvitationDataLayer = require('./../invitations/invitations.datalayer')
const InviteAgentTokenDataLayer = require('./../inviteagenttoken/inviteagenttoken.datalayer')
const UserDataLayer = require('./../user/user.datalayer')
const PermissionDataLayer = require('./../permissions/permissions.datalayer')
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
          description: 'The user account logged in does not belong to any company. Please contact support'
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
          let gotCount = results[0] ? results[0] : null
          let gotCountAgentWithEmail = results[1] ? results[1] : null
          let gotCountAgent = results[2] ? results[2] : null

          if (gotCount > 0) {
            logger.serverLog(TAG, `${req.body.name} is already invited.`)
            return res.status(200).json({
              status: 'failed',
              description: `${req.body.name} is already invited.`
            })
          } else if (gotCountAgentWithEmail > 0) {
            logger.serverLog(TAG, `${req.body.name} is already on KiboPush.`)
            return res.status(200).json({
              status: 'failed',
              description: `${req.body.name} is already on KiboPush.`
            })
          } else if (gotCountAgent > 0) {
            logger.serverLog(TAG, `${req.body.name} is already a member.`)
            return res.status(200).json({
              status: 'failed',
              description: `${req.body.name} is already a member.`
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
                let email = new sendgrid.Email(logicLayer.getEmailParameters())
                email = logicLayer.setEmailBody(email, req.user, companyUser, uniqueTokenId)
                sendgrid.send(email, (err, json) => {
                  logger.serverLog(TAG, `response from sendgrid send: ${json}`)
                  err
                    ? logger.serverLog(TAG, `error at sendgrid send ${err}`)
                    : logger.serverLog(TAG, `response from sendgrid send: ${json}`)

                  json
                    ? res.status(200).json(
                      {status: 'success', description: 'Email has been sent'})
                    : res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err)}`
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
            description: `Internal Server Error ${JSON.stringify(err)}`
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
    .findAllPostObjectsUsingQuery(req.body)
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

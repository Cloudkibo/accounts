const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const InviteAgentTokenDataLayer = require('./../inviteagenttoken/inviteagenttoken.datalayer')
const datalayer = require('./invitations.datalayer')
const util = require('util')
const logger = require('./../../../components/logger')
const TAG = 'api/v1/inviteagenttoken/inviteagenttoken.controller.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the index point')
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQuery({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }

      datalayer
        .findAllInvitationsObjectUsingQuery({companyId: companyUser.companyId})
        .then(invitations => {
          res.status(200).json({status: 'success', payload: invitations})
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at: ${util.inspect(err)}`)
          return res.status(500)
            .json({status: 'failed', description: 'Internal Server Error'})
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at: ${util.inspect(err)}`)
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    })
}

exports.cancel = function (req, res) {
  logger.serverLog(TAG, 'Hit the index point')
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQuery({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }

      let removeInvitation = datalayer
        .deleteInvitationObjectUsingQuery({
          email: req.body.email,
          companyId: companyUser.companyId})
      let removeInitationToken = InviteAgentTokenDataLayer
        .deleteInvitationTokenObjectUsingQuery({
          email: req.body.email,
          companyId: companyUser.companyId})
      Promise.all([removeInvitation, removeInitationToken])
        .then(result => {
          res.status(200).json({
            status: 'success',
            description: 'Invitation has been cancelled.'
          })
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at: ${util.inspect(err)}`)
          return res.status(500)
            .json({status: 'failed', description: 'Internal Server Error'})
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at: ${util.inspect(err)}`)
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    })
}

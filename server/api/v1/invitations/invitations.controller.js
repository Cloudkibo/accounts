const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const InviteAgentTokenDataLayer = require('./../inviteagenttoken/inviteagenttoken.datalayer')
const datalayer = require('./invitations.datalayer')
const util = require('util')
const logger = require('./../../../components/logger')
const TAG = 'api/v1/inviteagenttoken/inviteagenttoken.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the index point')
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        sendErrorResponse(res, 404, '', 'The user account does not belong to any company. Please contact support')
      }

      datalayer
        .findAllInvitationsObjectUsingQuery({companyId: companyUser.companyId})
        .then(invitations => {
          sendSuccessResponse(res, 200, invitations)
        })
        .catch(err => {
          const message = err || 'Failed to  find All Invitations '
          logger.serverLog(message, `${TAG}: exports.index`, req.body, {}, 'error')
          sendErrorResponse(res, 500, '', 'Internal Server Error')
        })
    })
    .catch(err => {
      const message = err || 'Failed to  find CompanyUser'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {}, 'error')
      sendErrorResponse(res, 500, '', 'Internal Server Error')
    })
}

exports.cancel = function (req, res) {
  logger.serverLog(TAG, 'Hit the index point')
  CompanyUserDataLayer
    .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      if (!companyUser) {
        sendErrorResponse(res, 404, '', 'The user account does not belong to any company. Please contact support')
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
          sendSuccessResponse(res, 200, 'Invitation has been cancelled.')
        })
        .catch(err => {
          const message = err || 'Failed to remove Invitation'
          logger.serverLog(message, `${TAG}: exports.cancel`, req.body, {}, 'error')
          sendErrorResponse(res, 500, '', 'Internal Server Error')
        })
    })
    .catch(err => {
      const message = err || 'Failed to Find CompanyUser'
      logger.serverLog(message, `${TAG}: exports.cancel`, req.body, {}, 'error')
      sendErrorResponse(res, 500, '', 'Internal Server Error')
    })
}

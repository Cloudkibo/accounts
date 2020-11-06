// eslint-disable-next-line no-unused-vars
const logger = require('./../../../components/logger')
const datalayer = require('./inviteagenttoken.datalayer')
const InvitationDataLayer = require('./../invitations/invitations.datalayer')
const util = require('util')
// const path = require('path')
// eslint-disable-next-line no-unused-vars
const TAG = 'api/v1/inviteagenttoken/inviteagenttoken.controller.js'
const { sendErrorResponse } = require('../../global/response')

exports.verify = function (req, res) {
  datalayer
    .findOneCompanyUserObjectUsingQuery({token: req.params.id})
    .then(verificationToken => {
      if (!verificationToken) {
        // This path needs to be updated
        return res.render('layouts/invitationExpire', {expireLink: true})
      } else {
        InvitationDataLayer
          .findOneInvitationsObjectUsingQuery({
            email: verificationToken.email,
            companyId: verificationToken.companyId})
          .then(invitation => {
            if (!invitation) {
              // This path needs to be updated
              return res.render('layouts/invitationExpire', {expireLink: true})
            }
            res.cookie('email', verificationToken.email,
              {expires: new Date(Date.now() + 900000)})
            res.cookie('name', invitation.name,
              {expires: new Date(Date.now() + 900000)})
            res.cookie('companyId', verificationToken.companyId,
              {expires: new Date(Date.now() + 900000)})
            res.cookie('companyName', verificationToken.companyName,
              {expires: new Date(Date.now() + 900000)})
            res.cookie('domain', verificationToken.domain,
              {expires: new Date(Date.now() + 900000)})
            return res.render('layouts/invitationExpire', {expireLink: false})
          })
          .catch(err => {
            const message = err || 'Failed to find CompanyUser'
            logger.serverLog(message, `${TAG}: exports.verify`, req.body, {}, 'error')
            sendErrorResponse(res, 500, '', 'Internal Server Error')
          })
      }
    })
    .catch(err => {
      const message = err || 'Failed to find verificationToken'
      logger.serverLog(message, `${TAG}: exports.verify`, req.body, {}, 'error')
      sendErrorResponse(res, 500, '', 'Internal Server Error')
    })
}

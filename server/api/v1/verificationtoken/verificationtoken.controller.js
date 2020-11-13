let datalayer = require('./verificationtoken.datalayer')
let logiclayer = require('./verificationtoken.logiclayer')
let UserLogicLayer = require('./../user/user.logiclayer')
let UserDataLayer = require('./../user/user.datalayer')
let CompanyProfileDataLayer = require('./../companyprofile/companyprofile.datalayer')
let CompanyUsersDataLayer = require('./../companyuser/companyuser.datalayer')
let config = require('./../../../config/environment/index')
let path = require('path')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const logger = require('../../../components/logger')
const utility = require('./../../../components/utility')

const TAG = '/api/v1/verificationtoken/verificationtoken.controller.js'

// Get a single verificationtoken
exports.verify = function (req, res) {

  datalayer.findOneVerificationTokenObject({token: req.params.id})
    .then(verificationtoken => {
      if (!verificationtoken) {
        // Change the path according to requirement
        // return res.sendFile(path.join(config.root, 'client/pages/verification_failed.html'))
        return res.render('layouts/verification', {verification: false, isAlreadyVerified: false})
      }

      UserDataLayer.findOneUserObjectUsingQuery({_id: verificationtoken.userId})
        .then(user => {
          if (!user) {
            // Change the path according to requirement
            // return res.sendFile(path.join(config.root, 'client/pages/verification_failed.html'))
            return res.render('layouts/verification', {verification: false, isAlreadyVerified: false})
          } else {
            CompanyUsersDataLayer
              .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: user.domain_email})
              .then(companyuser => {
                return CompanyProfileDataLayer
                  .findOneCPWithPlanPop({_id: companyuser.companyId}, true, 'planId')
              })
              .then(company => {
                if (!user.emailVerified) {
                  user.emailVerified = true
                  let sendgrid = utility.getSendGridObject()
                  let email = new sendgrid.Email(logiclayer.getEmailHeader(user))
                  if (company.planId.unique_ID === 'plan_C' || company.planId.unique_ID === 'plan_D') {
                    if (user.role === 'buyer') {
                      logiclayer.setTeamBuyerEmailBody(email, user)
                    } else {
                      logiclayer.setTeamAgentEmailBody(email, user)
                    }
                  } else {
                    logiclayer.setIndividualEmailBody(email, user)
                  }

                  sendgrid.send(email, function (err, json) {
                    if (err) logger.serverLog('Unable to send email', `${TAG}: exports.verify`, req.body, {user: req.user}, 'error')
                  })
                  UserDataLayer.saveUserObject(user)
                    .then(updatedUser => {
                      // Update the UI path
                      // return res.sendFile(path.join(config.root, 'client/pages/verification_success.html'))
                      return res.render('layouts/verification', {verification: true, isAlreadyVerified: false})
                    })
                } else {
                  return res.render('layouts/verification', {isAlreadyVerified: true})
                }
              })
          }
        })
        .catch(err => {
          const message = err || 'Failed to fetch User'
          logger.serverLog(message, `${TAG}: exports.verify`, req.body, {user: req.user}, 'error')
          sendErrorResponse(res, 500, '', err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to fetch verification token'
      logger.serverLog(message, `${TAG}: exports.verify`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, '', err)
    })
}

exports.resend = function (req, res) {
  if (!req.user.emailVerified) {
    let tokenString = UserLogicLayer.getRandomString()
    datalayer.createVerificationToken({ userId: req.user._id, token: tokenString })
      .then(result => {
        let sendgrid = utility.getSendGridObject()
        let email = new sendgrid.Email(logiclayer.getEmailResendHeader(req.user))
        logiclayer.getResendEmailBody(email, tokenString)
        sendgrid.send(email, (err) => {
          if (err) { return res.status(500).json({status: 'failed', description: 'Internal Server Error ' + err}) }
          sendSuccessResponse(res, 200, 'Verification email has been sent. Please check your email ')
        })
      })
      .catch(err => {
        const message = err || 'Failed to create verification token'
        logger.serverLog(message, `${TAG}: exports.resend`, req.body, {user: req.user}, 'error') 
        sendErrorResponse(res, 500, '', err) 
      })
  } else {
    sendSuccessResponse(res, 200, 'You have already verified your email address. Please refresh your page')
  }
}

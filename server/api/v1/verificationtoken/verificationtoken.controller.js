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
  logger.serverLog(TAG, 'Hit the verify controller index')

  datalayer.findOneVerificationTokenObject({token: req.params.id})
    .then(verificationtoken => {
      if (!verificationtoken) {
        // Change the path according to requirement
        // return res.sendFile(path.join(config.root, 'client/pages/verification_failed.html'))
        logger.serverLog(TAG, `Verification token not found`)
        return res.render('layouts/verification', {verification: false})
      }

      UserDataLayer.findOneUserObjectUsingQuery({_id: verificationtoken.userId})
        .then(user => {
          if (!user) {
            // Change the path according to requirement
            // return res.sendFile(path.join(config.root, 'client/pages/verification_failed.html'))
            logger.serverLog(TAG, `User Object not found`)
            return res.render('layouts/verification', {verification: false})
          } else {
            CompanyUsersDataLayer
              .findOneCompanyUserObjectUsingQueryPoppulate({domain_email: user.domain_email})
              .then(companyuser => {
                logger.serverLog(TAG, `Company User found ${companyuser}`)
                return CompanyProfileDataLayer
                  .findOneCPWithPlanPop({_id: companyuser.companyId}, true, 'planId')
              })
              .then(company => {
                if (!user.emailVerified) {
                  logger.serverLog(TAG, `Company Profile found ${company}`)
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
                    if (err) logger.serverLog(TAG, {status: 'failed', description: 'Internal Server Error'})
                  })
                  logger.serverLog(TAG, `Going to save user object ${user}`)
                  UserDataLayer.saveUserObject(user)
                    .then(updatedUser => {
                      // Update the UI path
                      // return res.sendFile(path.join(config.root, 'client/pages/verification_success.html'))
                      logger.serverLog(TAG, `Updated User: ${user}`)
                      return res.render('layouts/verification', {verification: true})
                    })
                } else {
                  return res.render('layouts/verification', {isAlreadyVerified: true})
                }
              })
          }
        })
        .catch(err => {
          sendErrorResponse(res, 500, '', err)
        })
    })
    .catch(err => {
      sendErrorResponse(res, 500, '', err)
    })
}

exports.resend = function (req, res) {
  logger.serverLog(TAG, `Resending verification email`)
  if (!req.user.emailVerified) {
    let tokenString = UserLogicLayer.getRandomString()
    datalayer.createVerificationToken({ userId: req.user._id, token: tokenString })
      .then(result => {
        let sendgrid = utility.getSendGridObject()
        let email = new sendgrid.Email(logiclayer.getEmailResendHeader(req.user))
        logiclayer.getResendEmailBody(email, tokenString)
        sendgrid.send(email, (err) => {
          if (err) { return res.status(500).json({status: 'failed', description: 'Internal Server Error ' + err}) }
          logger.serverLog(TAG, `verification email resent: ${JSON.stringify(email)}`)
          sendSuccessResponse(res, 200, 'Verification email has been sent. Please check your email ')
        })
      })
      .catch(err => { sendErrorResponse(res, 500, '', err) })
  } else {
    sendSuccessResponse(res, 200, 'You have already verified your email address. Please refresh your page')
  }
}

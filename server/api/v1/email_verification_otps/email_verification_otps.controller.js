let datalayer = require('./email_verification_otps.datalayer')
let logiclayer = require('./email_verification_otps.logiclayer')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const logger = require('../../../components/logger')
const utility = require('./../../../components/utility')

const TAG = '/api/v1/email_verification_otps/email_verification_otps.controller.js'

// Get a single verificationtoken
exports.create = function (req, res) {
  const token = 'f' + Math.floor(100000 + Math.random() * 900000)
  const payload = {
    companyId: req.body.companyId,
    otp: token,
    platform: req.body.platform,
    commercePlatform: req.body.commercePlatform,
    subscriberId: req.body.subscriberId,
    phone: req.body.phone,
    emailAddress: req.body.emailAddress
  }
  datalayer.createVerificationOtp(payload)
    .then(result => {
      let sendgrid = utility.getSendGridObject()
      let email = new sendgrid.Email(logiclayer.getEmailHeader(req.body))
      logiclayer.getEmailBody(email, token)
      sendgrid.send(email, (err) => {
        if (err) {
          const message = err || 'Failed to send email'
          logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
          return sendErrorResponse(res, 500, 'Internal Server Error', err)
        }
        sendSuccessResponse(res, 200, { otp: token })
      })
    })
    .catch(err => {
      const message = err || 'Failed to create verification otp'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {}, 'error')
      sendErrorResponse(res, 500, '', err)
    })
}

exports.verify = function (req, res) {
  datalayer.findOneOtpObject(req.body)
    .then(result => {
      if (result) {
        sendSuccessResponse(res, 200, 'otp matched')
        datalayer.deleteVerificationOtp(result._id)
          .then(deleted => {
            const message = 'OTP deleted successfully'
            logger.serverLog(message, `${TAG}: exports.verify`, req.body, {}, 'info')
          })
          .catch(err => {
            const message = err || 'Failed to delete verification otp'
            logger.serverLog(message, `${TAG}: exports.verify`, req.body, {}, 'error')
          })
      } else {
        sendErrorResponse(res, 404, 'OTP not matched or expired.')
      }
    })
    .catch(err => {
      const message = err || 'Failed to find verification otp'
      logger.serverLog(message, `${TAG}: exports.verify`, req.body, {}, 'error')
      sendErrorResponse(res, 500, '', err)
    })
  /*
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
                    if (err) {
                      const message = err || 'Failed to send email'
                      logger.serverLog(message, `${TAG}: exports.verify`, req.body, {user: req.user}, 'error')
                    }
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
    */
}

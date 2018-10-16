let datalayer = require('./verificationtoken.datalayer')
let logiclayer = require('./verificationtoken.logiclayer')
let UserLogicLayer = require('./../user/user.logiclayer')
let UserDataLayer = require('./../user/user.datalayer')
let CompanyProfileDataLayer = require('./../companyprofile/companyprofile.datalayer')
let CompanyUsersDataLayer = require('./../companyuser/companyuser.datalayer')
let config = require('./../../../config/environment/index')
let path = require('path')

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
        return res.render('layouts/verification', {verification: false})
      }

      UserDataLayer.findOneUserObjectUsingQuery({_id: verificationtoken.userId})
        .then(user => {
          if (!user) {
            // Change the path according to requirement
            // return res.sendFile(path.join(config.root, 'client/pages/verification_failed.html'))
            return res.render('layouts/verification', {verification: false})
          } else {
            CompanyUsersDataLayer
              .findOneCompanyUserObjectUsingQuery({domain_email: user.domain_email})
              .then(companyuser => {
                return CompanyProfileDataLayer
                  .findOneCompanyProfileObjectUsingQuery({_id: companyuser.companyId})
              })
              .then(company => {
                user['emailVerified'] = 'Yes'
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
                UserDataLayer.saveUserObject(user)
                  .then(user => {
                    // Update the UI path
                    // return res.sendFile(path.join(config.root, 'client/pages/verification_success.html'))
                    return res.render('layouts/verification', {verification: true})
                  })
              })
          }
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', description: `Err: ${err}`})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', description: `Err: ${err}`})
    })
}

exports.resend = function (req, res) {
  logger.serverLog(TAG, `Resending verification email`)

  let tokenString = UserLogicLayer.getRandomString()
  datalayer.createVerificationToken({ userId: req.user._id, token: tokenString })
    .then(tokenString => {
      let sendgrid = utility.getSendGridObject()
      let email = new sendgrid.Email(logiclayer.getEmailResendHeader(req.user))
      email = logiclayer.getResendEmailBody(email, tokenString)
      sendgrid.send(email, function (err) {
        if (err) { return res.status(500).json({status: 'failed', description: 'Internal Server Error ' + err}) }
        logger.serverLog(TAG, `verification email resent: ${JSON.stringify(email)}`)
        res.status(201).json({ status: 'success', description: 'Verification email has been sent' })
      })
    })
    .catch(err => { return res.status(500).json({status: 'failed', description: 'Internal Server Error ' + err}) })
}

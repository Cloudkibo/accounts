'use strict'

var express = require('express')
var passport = require('passport')
var auth = require('../auth.service')
let User = require('./../../api/v1/user/user.model')
let CompanyUsers = require('./../../api/v1/companyuser/companyuser.model')
let CompanyProfile = require('./../../api/v1/companyprofile/companyprofile.model')
let logger = require('./../../../server/components/logger')

let TAG = '/server/auth/local/index.js'

var router = express.Router()

router.post('/', function (req, res, next) {
  if (req.body.domain) {
    User.findOne({
      email: req.body.email.toLowerCase()
    }, (err, user) => {
      if (err) {
        return res.status(501)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!user) {
        return res.status(401)
          .json({
            status: 'failed',
            description: 'No account found with this email address.'
          })
      }
      user = user.toObject()
      if (user.domain !== req.body.domain.toLowerCase()) {
        return res.status(401)
          .json({
            status: 'failed',
            description: 'This workspace name is not registered with us or your account does not belong to this domain'
          })
      }
      if (user.domain === req.body.domain.toLowerCase() && user.email !== req.body.email.toLowerCase()) {
        return res.status(401)
          .json({
            status: 'failed',
            description: 'No account found with this email address.'
          })
      }
      logger.serverLog(TAG, `User in login: ${JSON.stringify(user)}`)
      CompanyUsers.findOne({domain_email: user.domain_email}, (err, companyuser) => {
        if (err) {
          return res.status(501)
            .json({status: 'failed', description: 'Internal Server Error'})
        }

        CompanyProfile.findOne({_id: companyuser.companyId}).populate('planId').exec((err, company) => {
          if (err) {
            return res.status(501)
              .json({status: 'failed', description: 'Internal Server Error'})
          }
          if (['plan_C', 'plan_D'].indexOf(company.planId.unique_ID) < 0) {
            return res.status(401)
              .json({
                status: 'failed',
                description: 'Given account information does not match any team account in our records'
              })
          }
          passport.authenticate('email-local', function (err, user, info) {
            var error = err || info
            if (error) return res.status(501).json({status: 'failed', description: error.message, error: '' + JSON.stringify(error)})
            if (!user) return res.json(404).json({message: 'User Not Found'})
            req.user = user
            return auth.setTokenCookie(req, res)
          })(req, res, next)
        })
      })
    })
  } else {
    User.findOne({
      email: req.body.email.toLowerCase()
    }, (err, user) => {
      if (err) {
        return res.status(501)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!user) {
        return res.status(401).json({
          status: 'failed',
          description: 'No account found with this email address.'
        })
      }

      CompanyUsers.findOne({domain_email: user.domain_email}, (err, companyuser) => {
        if (err) {
          return res.status(501)
            .json({status: 'failed', description: 'Internal Server Error'})
        }

        CompanyProfile.findOne({_id: companyuser.companyId}).populate('planId').exec((err, company) => {
          if (err) {
            return res.status(501)
              .json({status: 'failed', description: 'Internal Server Error'})
          }
          if (['plan_A', 'plan_B'].indexOf(company.planId.unique_ID) < 0) {
            return res.status(401).json({
              status: 'failed',
              description: 'Given account information does not match any individual account in our records'
            })
          }
          passport.authenticate('email-local', function (err, user, info) {
            var error = err || info
            if (error) return res.status(501).json({status: 'failed', description: error.message, error: '' + JSON.stringify(error)})
            if (!user) return res.json(404).json({message: 'User Not Found'})
            req.user = user
            return auth.setTokenCookie(req, res)
          })(req, res, next)
        })
      })
    })
  }
})

// router.post('/', function (req, res, next) {
//   if (req.body.email) {
//     passport.authenticate('email-local', function (err, user, info) {
//       var error = err || info
//       if (error) return res.status(501).json({status: 'failed', description: error.message, error: '' + JSON.stringify(error)})
//       if (!user) return res.json(404).json({message: 'User Not Found'})
//       req.user = user
//       return auth.setTokenCookie(req, res)
//     })(req, res, next)
//   }
// })

module.exports = router

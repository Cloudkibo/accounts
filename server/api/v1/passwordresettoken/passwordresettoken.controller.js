
'use strict'
// eslint-disable-next-line no-unused-vars
const logger = require('../../../components/logger')
const utility = require('../../../components/utility')
// eslint-disable-next-line no-unused-vars
const TAG = '/api/v1/passwordresettoken/passwordresettoken.controller.js'
let Passwordresettoken = require('./passwordresettoken.model')
let userDataLayer = require('./../user/user.datalayer')
let resetTokenLogicLayer = require('./passwordresettoken.logiclayer')
let resetTokenDataLayer = require('./passwordresettoken.datalayer')
const config = require('./../../../config/environment')
let path = require('path')

exports.forgot = function (req, res) {
  userDataLayer
    .findOneUserByEmail(req.body.email)
    .then(fetchedUser => {
      if (!fetchedUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'Sorry! No such account or company exists in our database.'
        })
      }
      let token = resetTokenLogicLayer.getRandomString()
      resetTokenDataLayer
        .createResetTokenObject({userId: fetchedUser._id, token: token})
        .then(result => {
          let email = resetTokenLogicLayer
            .getEmailObject(
              fetchedUser.email,
              'support@cloudkibo.com',
              'KiboPush: Password Reset',
              'Password Reset'
            )

          let emailWithBody = resetTokenLogicLayer.getForgotEmailWithBody(email, token, config.domain)
          utility
            .getSendGridObject()
            .send(emailWithBody, function (err, json) {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }

              res.status(200).json({
                status: 'success',
                description: 'Password Reset Link has been sent to your email address. Check your spam or junk folder if you have not received our email.'
              })
            })
        })
        .catch(err => {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        })
    })
    .catch(err => {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.reset = function (req, res) {
  let token = req.body.token

  Passwordresettoken.findOne({token: token}, function (err, doc) {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG,
      `Password Reset Token ${JSON.stringify(doc)}`)
    if (!doc) {
      res.sendFile(
        path.join(config.root, 'client/pages/change_password_failed.html'))
    }
    if (doc) {
      User.findOne({_id: doc.userId}, function (err, user) {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        if (!user) {
          return res.status(404).json({
            status: 'failed',
            description: 'User does not exist'
          })
        }

        user.password = String(req.body.new_password)
        user.save(function (err) {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          Passwordresettoken.remove({token: token}, function (err, doc) {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            res.status(200).json({
              status: 'success',
              description: 'Password successfully changed. Please login with your new password.'
            })
          })
        })
      })
    }
  })
}

exports.verify = function (req, res) {
  resetTokenDataLayer
    .findResetTokenObjectUsingToken(req.params.id)
    .then(result => {
      // Following will be updated with change password views
      result
        ? res.sendFile(
          path.join(config.root, 'client/pages/change_password_failed.html'))
        : res.sendFile(
          path.join(config.root, 'client/pages/change_password.html'))
    })
    .catch(err => {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}

exports.change = function (req, res) {
  let userId = req.user._id
  let oldPass = String(req.body.old_password)
  let newPass = String(req.body.new_password)

  userDataLayer
    .findOneUserObject(userId)
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass
        user.save().then(err => {
          err
            ? res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
            : res.status(200).json(
              {status: 'success', description: 'Password changed successfully.'})
        })
      } else {
        res.status(403)
          .json({status: 'failed', description: 'Wrong current password.'})
      }
    })
    .catch(err => {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    })
}


'use strict'
// eslint-disable-next-line no-unused-vars
const logger = require('../../../components/logger')
const utility = require('../../../components/utility')
// eslint-disable-next-line no-unused-vars
const TAG = '/api/v1/passwordresettoken/passwordresettoken.controller.js'
let userDataLayer = require('./../user/user.datalayer')
let resetTokenLogicLayer = require('./passwordresettoken.logiclayer')
let resetTokenDataLayer = require('./passwordresettoken.datalayer')
const config = require('./../../../config/environment')
let path = require('path')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
let util = require('util')

exports.forgot = function (req, res) {
  userDataLayer
    .findOneUserByEmail(req.body)
    .then(fetchedUser => {
      if (!fetchedUser) {
        sendErrorResponse(res, 404, '', 'Sorry! No such account or company exists in our database.')
      } else {
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
                  console.log('in catch 3', err)
                  sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
                } else {
                  sendSuccessResponse(res, 200, '', 'Password Reset Link has been sent to your email address. Check your spam or junk folder if you have not received our email.')
                }
              })
          })
          .catch(err => {
            console.log('in catch 1')
            sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
          })
      }
    })
    .catch(err => {
      console.log('in catch 2', err)
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.reset = function (req, res) {
  let token = req.body.token

  resetTokenDataLayer
    .findResetTokenObjectUsingToken(token)
    .then(foundObject => {
      if (!foundObject) {
        res.sendFile(
          path.join(config.root, 'views/pages/change_password_failed.html'))
      } else {
        logger.serverLog(TAG, `password with string : ${String(req.body.new_password)}`)
        return userDataLayer.findOneUserObject({_id: foundObject.userId})
      }
    })
    .then(foundUser => {
      if (foundUser.authenticate(req.body.new_password)) {
        logger.serverLog(TAG, `existing password : ${String(req.body.new_password)}`)
        sendErrorResponse(res, 400, '', 'New password cannot be same as old password')
      } else {
        logger.serverLog(TAG, `found user : ${String(foundUser)}`)
        foundUser.password = String(req.body.new_password)
        return userDataLayer.saveUserObject(foundUser)
      }
    })
    .then(result => {
      logger.serverLog(TAG, `updated user : ${String(result)}`)
      return resetTokenDataLayer.removeTokenObjectUsingToken(token)
    })
    .then(result => {
      logger.serverLog(TAG, `delete token object ${result}`)
      sendSuccessResponse(res, 200, '', 'Password successfully changed. Please login with your new password.')
    })
    .catch(err => {
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.verify = function (req, res) {
  resetTokenDataLayer
    .findResetTokenObjectUsingToken(req.params.id)
    .then(result => {
      // Following will be updated with change password views
      logger.serverLog(TAG, ``)
      result
        ? res.sendFile(
          path.join(config.root, 'views/pages/change_password.html'))
        : res.sendFile(
          path.join(config.root, 'views/pages/change_password_failed.html'))
    })
    .catch(err => {
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
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
        user.save().then(save => {
          sendSuccessResponse(res, 200, '', 'Password changed successfully.')
        })
          .catch((err) => {
            sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
          })
      } else {
        sendErrorResponse(res, 404, '', 'Wrong current password.')
      }
    })
    .catch(err => {
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.forgotWorkspaceName = function (req, res) {
  userDataLayer
    .findOneUserByEmail(req.body)
    .then(user => {
      if (!user) {
        logger.serverLog(TAG, `fetchedUser not found ${util.inspect(user)}`)
        sendErrorResponse(res, 404, '', 'Sorry! No such account or company exists in our database.')
      }
      let sendgrid = require('sendgrid')(config.sendgrid.username,
        config.sendgrid.password)

      var email = new sendgrid.Email({
        to: user.email,
        from: 'support@cloudkibo.com',
        subject: 'KiboPush: Workspace Name',
        text: 'Workspace Name'
      })

      email.setHtml(
        '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
        '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
        '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
        '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
        '<p style="color: #ffffff"> KiboPush - Workspace Name </p> </td></tr> </table> </td> </tr> </table> ' +
        '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
        '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
        '<tr> <td class="wrapper last"> <p> Hello, <br> This email has been sent to you to inform you about the workspace name for your kibopush account. If this was not requested by you, you can ignore it. </p> <p> </p>  <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
         '<tr> <p>The workspace name for your account is: <b>' + user.domain + '</b></p></tr>',
        '</a> </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
        '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

      sendgrid.send(email, function (err, json) {
        if (err) {
          sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
        }

        sendSuccessResponse(res, 200, '', 'Workspace Name has been sent to your email address. Check your spam or junk folder if you have not received our email.')
      })
    })
    .catch(err => {
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

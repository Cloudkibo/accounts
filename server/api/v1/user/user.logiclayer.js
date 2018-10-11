/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const dataLayer = require('./user.datalayer')
const crypto = require('crypto')
const MailChimp = require('mailchimp-api-v3')
const logger = require('./../../../components/logger')
const config = require('./../../../config/environment/index')
const utility = require('./../../../components/utility')

const TAG = '/api/v1/user/user.logiclayer.js'

const prepareUpdateUserPayload = (name, email, uiMode) => {
  let flag = true
  let temp = {}
  name ? temp.name = name : flag = false
  email ? temp.email = email : flag = false
  uiMode ? temp.uiMode = uiMode : flag = false

  return temp
}

const getResponse = (user, companyUser, permission) => {
  if (!user) {
    return {status: 'failed', description: 'User not found'}
  } else if (!companyUser) {
    return {
      status: 'failed',
      description: 'The user account does not belong to any company. Please contact support'
    }
  } else if (!permission) {
    return {
      status: 'failed',
      description: 'Permissions not set for this user. Please contact support'
    }
  }
}

const prepareUserPayload = (body, isTeam, domain) => {
  let random = getRandomString()
  let payload = {
    name: body.name,
    password: body.password,
    email: body.email.toLowerCase(),
    uiMode: body.uiMode,
    accountType: isTeam ? 'team' : 'individual',
    role: 'buyer',
    domain: isTeam ? body.domain.toLowerCase() : random,
    domain_email: isTeam
      ? body.domain.toLowerCase() + '' + body.email.toLowerCase()
      : domain + body.email.toLowerCase()
  }
  logger.serverLog(TAG, payload)
  return payload
}

const isTeamAccount = (body) => {
  let flag
  body.domain ? flag = true : flag = false
  return flag
}

const defaultPlans = (plans) => {
  let defaultPlanTeam, defaultPlanIndividual
  plans.forEach(doc => {
    if (doc.unique_ID === 'plan_D') defaultPlanTeam = doc
    if (doc.unique_ID === 'plan_B') defaultPlanIndividual = doc
  })
  return { defaultPlanIndividual, defaultPlanTeam }
}

const prepareCompanyProfile = (body, userId, isTeam, domain, defaultPlan) => {
  return {
    companyName: isTeam ? body.company_name : 'Pending ' + domain,
    companyDetail: isTeam ? body.company_description : 'Pending ' + domain,
    ownerId: userId,
    planId: defaultPlan._id
  }
}

const companyUsageData = (companyId) => {
  return {
    companyId: companyId,
    broadcasts: 0,
    surveys: 0,
    polls: 0,
    broadcast_templates: 0,
    survey_templates: 0,
    polls_templates: 0,
    sessions: 0,
    chat_messages: 0,
    facebook_pages: 0,
    bots: 0,
    subscribers: 0,
    labels: 0,
    phone_invitation: 0,
    facebook_autoposting: 0,
    twitter_autoposting: 0,
    wordpress_autoposting: 0,
    broadcast_sequences: 0,
    messages_per_sequence: 0,
    segmentation_lists: 0
  }
}

const createCustomerOnStripe = (email, name, companySaved) => {
  companySaved.createCustomer(email, name, function (err) {
    if (err) {
      logger.serverLog(TAG, `Failed to add customer on stripe : ${JSON.stringify(
        err)}`)
    }
  })
}

const prepareCompanyUser = (companySaved, user) => {
  return {
    companyId: companySaved._id,
    userId: user._id,
    domain_email: user.domain_email,
    role: 'buyer'
  }
}

const sendEmailUsingMailChimp = (body) => {
  let mailchimp = new MailChimp('2d154e5f15ca18180d52c40ad6e5971e-us12')

  mailchimp.post({
    path: '/lists/5a4e866849/members',
    body: {
      email_address: body.email,
      merge_fields: {
        FNAME: body.name
      },
      status: 'subscribed'
    }
  }, function (err, result) {
    if (err) {
      logger.serverLog(TAG, `welcome email error: ${JSON.stringify(err)}`)
    } else {
      logger.serverLog(TAG, `welcome email successfuly sent: ${JSON.stringify(result)}`)
    }
  })
}

const emailHeader = (body) => {
  return {
    to: body.email,
    from: 'support@cloudkibo.com',
    subject: 'KiboPush: Account Verification',
    text: 'Welcome to KiboPush'
  }
}

const inHouseEmailHeader = (body) => {
  return {
    to: ['sojharo@gmail.com', 'sojharo@live.com', 'jawaid@cloudkibo.com', 'jekram@hotmail.com', 'dayem@cloudkibo.com', 'surendar@cloudkibo.com'],
    from: 'support@cloudkibo.com',
    subject: 'KiboPush: Account created by ' + body.name,
    text: 'New Account Created'
  }
}

const setEmailBody = (email, tokenString, body) => {
  return email.setHtml(
    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
    '<p style="color: #ffffff">Verify your account</p> </td></tr> </table> </td> </tr> </table> ' +
    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
    '<tr> <td class="wrapper last"> <p> Hello,' + body.name + '<br> Thank you for joining KiboPush. <br>Use the following link to verify your account <br>  </p> <p>To accept invitation please click the following URL to activate your account:</p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
    '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="' +
    config.domain + '/api/email_verification/verify/' +
    tokenString +
    '"> ' + config.domain + '/api/email_verification/verify/' +
    tokenString +
    '</a> </td> <td class="expander"> </td> </tr> </table> <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
}

const setInHouseEmailBody = (email, body) => {
  return email.setHtml(
    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
    '<p style="color: #ffffff"> New account created on KiboPush. </p> </td></tr> </table> </td> </tr> </table> ' +
    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
    '<tr> <td class="wrapper last"> <p> Hello, <br> This is to inform you that following individual has created an account with KiboPush  </p> <p> <ul>' +
    '<li>Name: ' + body.name + '</li><li>Email: ' + body.email +
    ' </li> </ul> </p>  <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
    '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> </td> <td class="expander"> </td> </tr> </table> <p> Login now on KiboPush to see account details. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
}

const getEnableDeleteEmailText = (body, deletionDate) => {
  if (body.delete_option === 'DEL_ACCOUNT') {
    return `You have requested deleting your account. Your request will be served in 14 days time, after which you will not be able to reactivate or retrieve any of the information. Your account and entire data will be deleted by ${deletionDate}`
  } else if (body.delete_option === 'DEL_CHAT') {
    return `You have requested deleting your live chat data from KiboPush. Your request will be served in 14 days time, after which you will not be able to retrieve your information back. Your live chat data will be deleted by ${deletionDate}`
  } else if (body.delete_option === 'DEL_SUBSCRIBER') {
    return `You have requested deleting your subscribers information from Kibopush. Your request will served in 14 days time, after whcih you will not be able to retrieve your information back. Your subscribers data will be deleted by ${deletionDate}`
  }
}

const setEnableDeleteEmailBody = (email, emailText) => {
  email.setHtml(
    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
    '<p style="color: #ffffff">Delete Confirmation</p> </td></tr> </table> </td> </tr> </table> ' +
    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> ' +
    '<!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
   '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
   emailText +
   '<!-- END: Content -->' +
   '<!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
   '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
}

const setInhouseEnableDeleteEmailBody = (email, user, body, deletionDate) => {
  email.setHtml(
    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
    '<p style="color: #ffffff">Delete User Information</p> </td></tr> </table> </td> </tr> </table> ' +
    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> ' +
    '<!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
   '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
    user.name + ' has requested to delete his/her information from KiboPush. The information type to be deleted is: ' +
    body.delete_option + '. Data will be deleted by ' + deletionDate + '. ' +
    'Following are the user details:' +
    '<ul>' +
      '<li>' + user._id + '</li>' +
      '<li>' + user.email + '</li>' +
      '<li>' + user.role + '</li>' +
      '<li>' + user.plan.unique_ID + '</li>' +
    '</ul>' +
   '<!-- END: Content -->' +
  '<!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
  '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
}

const setInhouseCancelDeleteEmailBody = (email, user) => {
  email.setHtml(
    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
    '<p style="color: #ffffff">Delete User Informatio</p> </td></tr> </table> </td> </tr> </table> ' +
    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> ' +
    '<!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
   '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
    user.name + ' has requested to stop his/her deletion process. ' +
    'Following are the user details:' +
    '<ul>' +
      '<li>' + user._id + '</li>' +
      '<li>' + user.email + '</li>' +
      '<li>' + user.role + '</li>' +
      '<li>' + user.plan.unique_ID + '</li>' +
    '</ul>' +
   '<!-- END: Content -->' +
  '<!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
}

const getRandomString = () => {
  let today = new Date()
  let uid = crypto.randomBytes(5).toString('hex')
  return 'f' + uid + '' + today.getFullYear() + '' +
          (today.getMonth() + 1) + '' + today.getDate() + '' +
          today.getHours() + '' + today.getMinutes() + '' +
          today.getSeconds()
}

const isEmailAndDomainFound = (body) => {
  let temp = {}

  return new Promise((resolve, reject) => {
    dataLayer
      .findOneUserByEmail(body)
      .then(userWithEmail => {
        userWithEmail
          ? temp.email = true
          : temp.email = false

        dataLayer
          .findOneUserByDomain(body)
          .then(userWithDomain => {
            userWithDomain
              ? temp.domain = true
              : temp.domain = false
            resolve(temp)
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}

exports.getRandomString = getRandomString
exports.isEmailAndDomainFound = isEmailAndDomainFound
exports.isTeamAccount = isTeamAccount
exports.prepareUserPayload = prepareUserPayload
exports.prepareUpdateUserPayload = prepareUpdateUserPayload
exports.defaultPlans = defaultPlans
exports.prepareCompanyProfile = prepareCompanyProfile
exports.companyUsageData = companyUsageData
exports.createCustomerOnStripe = createCustomerOnStripe
exports.prepareCompanyUser = prepareCompanyUser
exports.sendEmailUsingMailChimp = sendEmailUsingMailChimp
exports.emailHeader = emailHeader
exports.inHouseEmailHeader = inHouseEmailHeader
exports.setEmailBody = setEmailBody
exports.setInHouseEmailBody = setInHouseEmailBody
exports.getResponse = getResponse
exports.getEnableDeleteEmailText = getEnableDeleteEmailText
exports.setEnableDeleteEmailBody = setEnableDeleteEmailBody
exports.setInhouseEnableDeleteEmailBody = setInhouseEnableDeleteEmailBody
exports.setInhouseCancelDeleteEmailBody = setInhouseCancelDeleteEmailBody

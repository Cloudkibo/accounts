/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const config = require('./../../../config/environment')

exports.preparePostPayload = (body) => {
  return {
    pageId: body.pageId,
    companyId: body.companyId,
    userId: body.userId,
    payload: body.payload,
    reply: body.reply,
    includedKeywords: body.includedKeywords,
    excludedKeywords: body.excludedKeywords
  }
}

exports.getEmailParameters = (email) => {
  return {
    to: email,
    from: 'support@cloudkibo.com',
    subject: 'KiboPush: Invitation',
    text: 'Welcome to KiboPush'
  }
}

exports.setCard = (profile, stripeToken) => {
  profile.setCard(stripeToken, function (err) {
    if (err) {
      if (err.code && err.code === 'card_declined') {
        return {
          status: 'failed',
          description: 'Your card was declined. Please provide a valid card.'
        }
      }
      return {
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      }
    }
    return {
      status: 'success',
      description: 'Card has been attached successfuly!'
    }
  })
}

exports.setPlan = (company, stripeToken, plan) => {
  company.setPlan(plan, stripeToken, function (err) {
    if (err) {
      if (err.code && err.code === 'card_declined') {
        return {
          status: 'failed',
          description: 'Your card was declined. Please provide a valid card.'
        }
      }
      return {
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      }
    }
    return {
      status: 'success',
      description: 'Plan has been updated successfuly!'
    }
  })
}

exports.setEmailBody = (emailObj, user, companyUser, uniqueTokenId) => {
  emailObj.setHtml(
    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
    '<p style="color: #ffffff">Inviting you as support agent</p> </td></tr> </table> </td> </tr> </table> ' +
    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
    '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
    user.name + ' has invited you to join ' +
    companyUser.companyId.companyName +
    ' as a Support Agent.</p> <p> <ul> <li>Company Name: ' +
    companyUser.companyId.companyName + '</li> ' +
    '<li>Workspace name: ' + user.domain +
    ' </li> </ul> </p> <p>To accept invitation please click the following URL to activate your account:</p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
    '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="' + config.domain + '/api/v1/inviteagenttoken/verify/' +
    uniqueTokenId +
    '">' + config.domain + '/api/v1/inviteagenttoken/verify/' +
    uniqueTokenId +
    '</a> </td> <td class="expander"> </td> </tr> </table> <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

  return emailObj
}

exports.prepareUpdatePostPayload = (body) => {
  let temp = {}
  if (body.includedKeywords) temp.includedKeywords = body.includedKeywords
  if (body.excludedKeywords) temp.excludedKeywords = body.excludedKeywords
  return temp
}

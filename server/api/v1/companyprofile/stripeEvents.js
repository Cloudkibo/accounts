'use strict'

const logger = require('../../../components/logger')
const TAG = 'api/companyprofile/stripeEvents.js'
const Companyprofile = require('./companyprofile.model')
const config = require('./../../../config/environment/index')

var knownEvents = {
  'account.updated': function (req, res, next) {
    res.status(200).end()
  },
  'account.application.deauthorized': function (req, res, next) {
    res.status(200).end()
  },
  'application_fee.created': function (req, res, next) {
    res.status(200).end()
  },
  'application_fee.refunded': function (req, res, next) {
    res.status(200).end()
  },
  'balance.available': function (req, res, next) {
    res.status(200).end()
  },
  'charge.succeeded': function (req, res, next) {
    Companyprofile.findOne({'stripe.customerId': req.body.data.object.customer}).populate('ownerId').exec((err, company) => {
      if (err) {
        const message = err || 'Error in find company Profile'
        logger.serverLog(message, `${TAG}: charge.succeeded`, req.body, {user: req.user}, 'error')  
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (company) {
        let sendgrid = require('sendgrid')(config.sendgrid.username,
          config.sendgrid.password)

        let email = new sendgrid.Email({
          to: company.ownerId.email,
          from: 'support@cloudkibo.com',
          subject: 'KiboPush: Payment Successful',
          text: 'Welcome to KiboPush'
        })
        let date = new Date()
        email.setHtml('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/><!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if (gte mso 9)|(IE)]> <style type="text/css"> body{width: 600px;margin: 0 auto;}table{border-collapse: collapse;}table, td{mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}</style><![endif]--> <style type="text/css"> body, p, div{font-family: arial; font-size: 14px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 480px !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}}</style> </head> <body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial; color: #000000; background-color: #ebebeb;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ebebeb"> <tr> <td valign="top" bgcolor="#ebebeb" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td><!--[if mso]> <center> <table><tr><td width="600"><![endif]--> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left"> <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="font-size:6px;line-height:10px;padding:35px 0px 0px 0px;background-color:#ffffff;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;" width="206" height="43" src="https://marketing-image-production.s3.amazonaws.com/uploads/63fe9859761f80dce4c7d46736baaa15ca671ce6533ec000c93401c7ac150bbec5ddae672e81ff4f6686750ed8e3fad14a60fc562df6c6fdf70a6ef40b2d9c56.png" alt="Logo"> </td></tr></table> <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""> </td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:10% !important;width:10%;height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/94c3f145d6c34c8f5347e2d5371b91b18784ea5fd109002f3f9fbd2ef64e91c560edc58da796bd4ad298bcb6435ebfca76b45ef3a2c266babf0204dea11a0825.png" alt="" width="60"> </td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:0px 045px 30px 45px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div style="text-align: center;"><span style="font-size:16px;"><strong><span style="color:#333333;">Payment Successful</span></strong></span></div></td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:0px 0px 0px 20px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div>Hi ' + company.ownerId.name + ',</div><div>&nbsp;</div><div>This is to confirm that your&nbsp;monthly payment to KiboPush was successful. Here are the details of your payment:</div><div>&nbsp;</div><div>Charge Date: ' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + '</div><div>Amount: $' + req.body.data.object.amount / 100 + '</div><div>Card Number: xxxx-xxxx-xxxx-' + req.body.data.object.source.last4 + '</div><div>&nbsp;</div><div>Thank you for continuous support.</div><div>&nbsp;</div><div><span style="font-size:14px;"><span style="color: rgb(32, 32, 32); font-family: Helvetica; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">Regards,</span><br style="color: rgb(32, 32, 32); font-family: Helvetica; font-size: 16px;"/><span style="color: rgb(32, 32, 32); font-family: Helvetica; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">Jawaid Ekram</span><br style="color: rgb(32, 32, 32); font-family: Helvetica; font-size: 16px;"/><span style="color: rgb(32, 32, 32); font-family: Helvetica; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">Founder / CEO KiboPush</span></span></div><div>&nbsp;</div></td></tr></table> </td></tr></table><!--[if mso]> </td></tr></table> </center><![endif]--> </td></tr></table> </td></tr></table> </td></tr></table> </div></center> </body></html>')

        sendgrid.send(email, function (err, json) {
          if (err) {
            const message = err || 'Error in find company Profile'
            logger.serverLog(message, `${TAG}: charge.succeeded`, req.body, {user: req.user}, 'error')  
          }
        })
      }
    })
    res.status(200).end()
  },
  'charge.failed': function (req, res, next) {
    Companyprofile.findOne({'stripe.customerId': req.body.data.object.customer}).populate('ownerId').exec((err, company) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (company) {
        let sendgrid = require('sendgrid')(config.sendgrid.username,
          config.sendgrid.password)

        let email = new sendgrid.Email({
          to: company.ownerId.email,
          from: 'support@cloudkibo.com',
          subject: 'KiboPush: Payment Failed',
          text: 'Welcome to KiboPush'
        })

        email.setHtml('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/><!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if (gte mso 9)|(IE)]> <style type="text/css"> body{width: 600px;margin: 0 auto;}table{border-collapse: collapse;}table, td{mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}</style><![endif]--> <style type="text/css"> body, p, div{font-family: arial; font-size: 14px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 480px !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}}</style> </head> <body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial; color: #000000; background-color: #ebebeb;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ebebeb"> <tr> <td valign="top" bgcolor="#ebebeb" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td><!--[if mso]> <center> <table><tr><td width="600"><![endif]--> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left"> <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="font-size:6px;line-height:10px;padding:35px 0px 0px 0px;background-color:#ffffff;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;" width="206" height="43" src="https://marketing-image-production.s3.amazonaws.com/uploads/63fe9859761f80dce4c7d46736baaa15ca671ce6533ec000c93401c7ac150bbec5ddae672e81ff4f6686750ed8e3fad14a60fc562df6c6fdf70a6ef40b2d9c56.png" alt="Logo"> </td></tr></table> <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""> </td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:10% !important;width:10%;height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/a97ddf95c2c4065c057face5654ce218376c78bdf814c38eead529e6d784a8b95915b47414af2dcf14473f5ed81d81aa873f771e048747ad8673d4dae646c686.png" alt="" width="60"> </td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:0px 045px 30px 45px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div style="text-align: center;"><span style="font-size:16px;"><strong><span style="color:#333333;">Payment Failed</span></strong></span></div></td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:0px 0px 0px 20px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div>Hi + company.ownerId.name + ,</div><div>&nbsp;</div><div>We are very sorry to inform you that we are unable to process your monthly payment because your card was declined.This may be due to the following reasons:</div><ul><li>Incorrect card number</li><li>Expired credit card</li><li>Incorrect Card Verification Code (CVC)</li><li>Credit limit reached.</li></ul><div>Please update your card details to continue using our services.&nbsp;</div><div>&nbsp;</div><div>Thank you!</div><div>&nbsp;</div><div><span style="font-size:14px;"><span style="color: rgb(32, 32, 32); font-family: Helvetica; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">Regards,</span><br style="color: rgb(32, 32, 32); font-family: Helvetica; font-size: 16px;"/><span style="color: rgb(32, 32, 32); font-family: Helvetica; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">Jawaid Ekram</span><br style="color: rgb(32, 32, 32); font-family: Helvetica; font-size: 16px;"/><span style="color: rgb(32, 32, 32); font-family: Helvetica; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">Founder / CEO KiboPush</span></span></div><div>&nbsp;</div></td></tr></table> </td></tr></table><!--[if mso]> </td></tr></table> </center><![endif]--> </td></tr></table> </td></tr></table> </td></tr></table> </div></center> </body></html>')

        sendgrid.send(email, function (err, json) {
          if (err) {
            const message = err || 'Error in send email'
            logger.serverLog(message, `${TAG}: charge.failed`, req.body, {user: req.user}, 'error')
          }
        })
      }
    })
    res.status(200).end()
  },
  'charge.refunded': function (req, res, next) {
    res.status(200).end()
  },
  'charge.captured': function (req, res, next) {
    res.status(200).end()
  },
  'charge.updated': function (req, res, next) {
    res.status(200).end()
  },
  'charge.dispute.created': function (req, res, next) {
    res.status(200).end()
  },
  'charge.dispute.updated': function (req, res, next) {
    res.status(200).end()
  },
  'charge.dispute.closed': function (req, res, next) {
    res.status(200).end()
  },
  'customer.created': function (req, res, next) {
    res.status(200).end()
  },
  'customer.updated': function (req, res, next) {
    res.status(200).end()
  },
  'customer.deleted': function (req, res, next) {
    res.status(200).end()
  },
  'customer.card.created': function (req, res, next) {
    res.status(200).end()
  },
  'customer.card.updated': function (req, res, next) {
    res.status(200).end()
  },
  'customer.card.deleted': function (req, res, next) {
    res.status(200).end()
  },
  'customer.subscription.created': function (req, res, next) {
    res.status(200).end()
  },
  'customer.subscription.updated': function (req, res, next) {
    res.status(200).end()
  },
  'customer.subscription.deleted': function (req, res, next) {
    res.status(200).end()
  },
  'customer.subscription.trial_will_end': function (req, res, next) {
    res.status(200).end()
  },
  'customer.discount.created': function (req, res, next) {
    res.status(200).end()
  },
  'customer.discount.updated': function (req, res, next) {
    res.status(200).end()
  },
  'customer.discount.deleted': function (req, res, next) {
    res.status(200).end()
  },
  'invoice.created': function (req, res, next) {
    res.status(200).end()
  },
  'invoice.updated': function (req, res, next) {
    res.status(200).end()
  },
  'invoice.payment_succeeded': function (req, res, next) {
    res.status(200).end()
  },
  'invoice.payment_failed ': function (req, res, next) {
    res.status(200).end()
  },
  'invoiceitem.created': function (req, res, next) {
    res.status(200).end()
  },
  'invoiceitem.updated': function (req, res, next) {
    res.status(200).end()
  },
  'invoiceitem.deleted': function (req, res, next) {
    res.status(200).end()
  },
  'plan.created': function (req, res, next) {
    res.status(200).end()
  },
  'plan.updated': function (req, res, next) {
    res.status(200).end()
  },
  'plan.deleted': function (req, res, next) {
    res.status(200).end()
  },
  'coupon.created': function (req, res, next) {
    res.status(200).end()
  },
  'coupon.deleted': function (req, res, next) {
    res.status(200).end()
  },
  'recipient.created': function (req, res, next) {
    res.status(200).end()
  },
  'recipient.updated': function (req, res, next) {
    res.status(200).end()
  },
  'recipient.deleted': function (req, res, next) {
    res.status(200).end()
  },
  'transfer.created': function (req, res, next) {
    res.status(200).end()
  },
  'transfer.updated': function (req, res, next) {
    res.status(200).end()
  },
  'transfer.paid': function (req, res, next) {
    res.status(200).end()
  },
  'transfer.failed': function (req, res, next) {
    res.status(200).end()
  },
  'ping': function (req, res, next) {
    res.status(200).end()
  }
}

module.exports = function (req, res, next) {
  if (req.stripeEvent && req.stripeEvent.type && knownEvents[req.stripeEvent.type]) {
    knownEvents[req.stripeEvent.type](req, res, next)
  } else {
    return next(new Error('Stripe Event not found'))
  }
}

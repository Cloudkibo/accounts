const logger = require('./../../components/logger')
const userDataLayer = require('./../../api/v1/user/user.datalayer')
const TAG = '/auth/tfa/tfa.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('./../../api/global/response')
const speakeasy = require('speakeasy')
const QRCode = require('qrcode')

exports.createSetup = function (req, res) {
  logger.serverLog(TAG, 'going to create enable 2factor auth')
  const secret = speakeasy.generateSecret({
    length: 10,
    name: req.user.email,
    issuer: 'KiboPush'
  })

  var url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: req.user.email,
    issuer: 'KiboPush',
    encoding: 'base32'
  })

  QRCode.toDataURL(url, async (err, dataURL) => {
    if (err) {
      logger.serverLog(TAG, `Error in generating QR code for 2FA.`, 'error')
      return sendErrorResponse(res, 500, err)
    }

    let tfaObject = {
      secret: '',
      tempSecret: secret.base32,
      dataURL,
      tfaURL: url
    }

    try {
      await userDataLayer.updateOneUserObjectUsingQuery({_id: req.user._id},
        {tfa: tfaObject, tfaEnabled: false}, {multi: false})

      let finalPayload = {
        message: 'TFA Auth needs to be verified',
        tempSecret: secret.base32,
        dataURL,
        tfaURL: secret.otpauth_url
      }

      sendSuccessResponse(res, 200, finalPayload)
    } catch (err) {
      logger.serverLog(TAG, `Error in generating QR code for 2FA.`, 'error')
      return sendErrorResponse(res, 500, err)
    }
  })
}

exports.deleteSetup = async function (req, res) {
  try {
    await userDataLayer.updateOneUserObjectUsingQuery({_id: req.user._id},
      {tfa: null, tfaEnabled: false}, {multi: false})

    sendSuccessResponse(res, 200, {}, 'Successfully deleted 2FA for the user')
  } catch (err) {
    logger.serverLog(TAG, `Error in deleting the 2FA for the user`, 'error')
    return sendErrorResponse(res, 500, err)
  }
}

exports.verifySetup = async function (req, res) {
  let isVerified = speakeasy.totp.verify({
    secret: req.user.tfa.tempSecret,
    encoding: 'base32',
    token: req.body.token
  })

  if (isVerified) {
    logger.serverLog(TAG, `TFA is verified to be enabled`, 'debug')

    await userDataLayer.updateOneUserObjectUsingQuery({_id: req.user._id},
      {'tfa.secret': req.user.tfa.tempSecret, tfaEnabled: true}, {multi: false})

    return sendSuccessResponse(res, 200, {}, 'Two-factor Auth is enabled successfully')
  }

  logger.serverLog(TAG, `TFA is verified to be wrong`, 'debug')

  return sendErrorResponse(res, 403, {message: 'Invalid Auth Code, verification failed. Please verify the system Date and Time'})
}

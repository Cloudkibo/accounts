const logger = require('../../../components/logger')
const logicLayer = require('./user.logiclayer')
const dataLayer = require('./user.datalayer')
const TAG = '/api/v1/user/user.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : res.status(500).json({status: 'failed', payload: 'ID is not provided'})

  dataLayer.findOneUserObject(id)
    .then(userObject => {
      return res.status(200).json({status: 'success', payload: userObject})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller index')
  let isTeam = logicLayer.isTeamAccount(req.body)

  logicLayer
    .isEmailAndDomainFound(req.body)
    .then(result => {
      if (result.email) {
        return res.status(422).json({
          status: 'failed',
          description: 'This email address already has an account on KiboPush. Contact support for more information.'
        })
      } else if (result.domain) {
        return res.status(422).json({
          status: 'failed',
          description: 'This workspace name already has an account on KiboPush. Contact support for more information.'
        })
      } else {
        let payload = logicLayer.prepareUserPayload(req.body, isTeam)
        dataLayer.createUserObject(payload)
          .then(result => {
            return res.status(200).json({status: 'success', payload: result})
          })
          .catch(err => {
            return res.status(500).json({status: 'failed', payload: err})
          })
      }
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : res.status(500).json({status: 'failed', payload: 'ID is not provided'})

  let name = req.body.name ? req.body.name : false
  let email = req.body.email ? req.body.email : false
  let uiMode = req.body.uiMode ? req.body.uiMode : false

  let payload = logicLayer.prepareUpdateUserPayload(name, email, uiMode)
  if (Object.keys(payload).length > 0) {
    dataLayer.updateUserObject(id, payload)
      .then(result => {
        return res.status(200).json({status: 'success', payload: result})
      })
      .catch(err => {
        logger.serverLog(TAG, `Error at update user ${util.inspect(err)}`)
        return res.status(500).json({status: 'failed', payload: err})
      })
  } else {
    logger.serverLog(TAG, `No field provided to update`)
    return res.status(500).json({status: 'failed', payload: 'Provide field to update'})
  }
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : res.status(500).json({status: 'failed', payload: 'ID is not provided'})

  dataLayer.deleteUserObject(id)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.enableDelete = function (req, res) {
  logger.serverLog(TAG, 'Enabling GDPR Delete')

  let deleteInformation = {delete_option: req.body.delete_option, deletion_date: req.body.deletion_date}
  dataLayer.updateUserObject(req.params._id, {deleteInformation})
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at enabling GDPR delete ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.cancelDeletion = function (req, res) {
  logger.serverLog(TAG, 'Disabling GDPR Delete')

  let deleteInformation = {delete_option: 'NONE', deletion_date: ''}
  dataLayer.updateUserObject(req.params._id, {deleteInformation})
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at enabling GDPR delete ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdateUserObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

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
      res.status(200).json({status: 'success', payload: userObject})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller index')
  dataLayer.createUserObject(req.body.name, req.body.password, req.body.email, req.body.uiMode)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the create user controller index')

  let id
  req.params._id
    ? id = req.params._id
    : res.status(500).json({status: 'failed', payload: 'ID is not provided'})

  let name = req.body.name ? req.body.name : false
  let password = req.body.password ? req.body.password : false
  let email = req.body.email ? req.body.email : false
  let uiMode = req.body.uiMode ? req.body.uiMode : false

  let payload = logicLayer.prepareUpdateUserPayload(name, password, email, uiMode)
  if (Object.keys(payload).length > 0) {
    dataLayer.updateUserObject(id, payload)
      .then(result => {
        res.status(200).json({status: 'success', payload: result})
      })
      .catch(err => {
        logger.serverLog(TAG, `Error at update user ${util.inspect(err)}`)
        res.status(500).json({status: 'failed', payload: err})
      })
  } else {
    logger.serverLog(TAG, `No field provided to update`)
    res.status(500).json({status: 'failed', payload: 'Provide field to update'})
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
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete user ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

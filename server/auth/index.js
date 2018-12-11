'use strict'

const express = require('express')

const router = express.Router()

const logger = require('../components/logger')
const config = require('../config/environment')
const Users = require('./../api/v1/user/user.model')
const auth = require('./auth.service')
const util = require('util')

const TAG = 'auth/index.js'

// todo see what to do with facebook passport integration
// require('./facebook/passport').setup(Users, config)
require('./local/passport').setup(Users, config)

// router.use('/facebook', require('./facebook'))
router.use('/local', require('./local'))

router.get('/scripts/jsonp', (req, res) => {
  logger.serverLog(TAG, req.query.callback)
  logger.serverLog(TAG, req.cookies)

  let token = req.cookies.token
  let callbackOfClient = req.query.callback
  //res.setHeader("Access-Control-Allow-Origin", "*")
  //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.type('.js')
  // res.setHeader("Content-Type", "application/javascript")
  res.send(`${callbackOfClient}("${token}");`)
})

// route to verify the token
router.get('/verify',
  (req, res, next) => { logger.serverLog(TAG, `before authenticated`); next() },
  auth.isAuthenticated(),
  (req, res, next) => { logger.serverLog(TAG, `AFTER authenticated`); next() },
  (req, res) => {
    res.status(200).json({status: 'success', description: 'Token verified', user: req.user})
  })

// This function will be used for sign out
router.get('/logout', (req, res) => {
  // if (!req.user) {
  //   return res.status(404).json({
  //     status: 'failed',
  //     description: 'Something went wrong, please try again.'
  //   })
  // }
  logger.serverLog(TAG, req.cookies)
  logger.serverLog(TAG, `Going to remove token cookie`)
  res.clearCookie('token')
  // We will change it to based on the request of project
  return res.redirect(req.query.continue)
})

module.exports = router

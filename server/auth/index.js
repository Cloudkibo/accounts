'use strict'

const express = require('express')

const router = express.Router()

const logger = require('../components/logger')
const config = require('../config/environment')
const Users = require('./../api/v1/user/user.model')

const TAG = 'auth/index.js'

// todo see what to do with facebook passport integration
// require('./facebook/passport').setup(Users, config)
require('./local/passport').setup(Users, config)

// router.use('/facebook', require('./facebook'))
router.use('/local', require('./local'))

router.use('/scripts/jsonp').get((req, res) => {
  logger.serverLog(TAG, req.query.callback)
  logger.serverLog(TAG, req.cookies)

  let token = req.cookies.token
  let callbackOfClient = req.query.callback
  res.send(`${callbackOfClient}("${token}")`)
})

module.exports = router

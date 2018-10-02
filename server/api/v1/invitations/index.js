'use strict'

var express = require('express')
var controller = require('./invitations.controller')

var router = express.Router()
const auth = require('./../../../auth/auth.service')

router.get('/',
  // auth.isAuthenticated(),
  controller.index)

router.post('/cancel',
  // auth.isAuthenticated(),
  controller.cancel)

module.exports = router

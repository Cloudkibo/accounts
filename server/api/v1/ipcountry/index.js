
'use strict'

var express = require('express')
var controller = require('./ipcountry.controller')
var cors = require('cors')

var router = express.Router()

router.post('/findIp',
  cors(),
  controller.findIp)

module.exports = router

'use strict'

let express = require('express')
let controller = require('./email_verification_otps.controller')

let router = express.Router()
const auth = require('../../../auth/auth.service')

router.post('/',
  auth.isAuthorizedWebHookTrigger(),
  controller.create)

router.post('/verify',
  auth.isAuthorizedWebHookTrigger(),
  controller.verify)

module.exports = router

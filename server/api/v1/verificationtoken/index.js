'use strict'

let express = require('express')
let controller = require('./verificationtoken.controller')

let router = express.Router()
const auth = require('../../../auth/auth.service')

router.get('/verify/:id', controller.verify)
router.get('/resend', controller.resend)

module.exports = router

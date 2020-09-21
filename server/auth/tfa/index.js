const express = require('express')
const router = express.Router()
const controller = require('./tfa.controller')
const auth = require('./../auth.service')

router.post('/setup', auth.isAuthenticated(), controller.createSetup)

router.delete('/setup', auth.isAuthenticated(), controller.deleteSetup)

router.post('/verify', auth.isAuthenticated(), controller.verifySetup)

module.exports = router

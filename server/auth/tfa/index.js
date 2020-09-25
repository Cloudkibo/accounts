const express = require('express')
const router = express.Router()
const controller = require('./tfa.controller')
const auth = require('./../auth.service')

router.post('/setup', auth.isAuthenticated(), auth.isSuperUserActingAsCustomer('write'), controller.createSetup)

router.delete('/setup', auth.isAuthenticated(), auth.isSuperUserActingAsCustomer('write'), controller.deleteSetup)

router.post('/verify', auth.isAuthenticated(), auth.isSuperUserActingAsCustomer('write'), controller.verifySetup)

module.exports = router

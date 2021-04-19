const express = require('express')
const router = express.Router()
const smsController = require('./smsController.js')

router.get('/sms/populatePlans', smsController.populatePlans)

module.exports = router

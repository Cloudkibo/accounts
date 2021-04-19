const express = require('express')
const router = express.Router()
const smsController = require('./smsController.js')

router.get('/sms/populatePlans', smsController.populatePlans)
router.get('/sms/populatePlanUsage', smsController.populatePlanUsage)

module.exports = router

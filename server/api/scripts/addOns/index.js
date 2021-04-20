const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/sms/populateAddOns', controller.populateAddOns)

module.exports = router

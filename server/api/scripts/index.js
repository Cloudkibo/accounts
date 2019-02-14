const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/susbscribers/normalizeDatetime', controller.normalizeSubscribersDatetime)
router.get('/susbscribers/normalizeDatetimeNull', controller.normalizeSubscribersDatetimeNull)
router.get('/subscribers/addFullName', controller.addFullName)
router.get('/subscribers/putSessionDetails', controller.putSessionDetails)

module.exports = router

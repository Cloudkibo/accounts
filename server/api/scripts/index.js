const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/susbscribers/normalizeDatetime', controller.normalizeSubscribersDatetime)

module.exports = router

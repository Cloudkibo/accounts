const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.post('/changeBroadcastApiLimit', controller.changeBroadcastApiLimit)
router.post('/changeBroadcastApiLimit/:id', controller.changeBroadcastApiLimitForOnePage)

router.get('/addConnectedFacebook', controller.addConnectedFacebook)

module.exports = router

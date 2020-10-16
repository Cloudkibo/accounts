const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/setSourceOfSubscribersToChatPlugin', controller.setSourceOfSubscribersToChatPlugin)

module.exports = router

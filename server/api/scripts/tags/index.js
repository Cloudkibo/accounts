const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.post('/getAssignedTagInfo', controller.getAssignedTagInfo)
router.post('/correctAssignedTags', controller.correctAssignedTags)
router.post('/removeDefaultTagSubscribers', controller.removeDefaultTagSubscribers)

module.exports = router

const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.post('/getAssignedTagInfo', controller.getAssignedTagInfo)
router.post('/correctAssignedTags', controller.correctAssignedTags)

module.exports = router

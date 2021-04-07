const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.post('/userPermissions', controller.normazliUserPermissions)

module.exports = router

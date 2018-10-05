const express = require('express')
const router = express.Router()
const controller = require('./companyuser.controller')

router.post('/query', controller.genericFetch)

module.exports = router

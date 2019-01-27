const express = require('express')
const router = express.Router()
const controller = require('./companyuser.controller')

router.post('/query', controller.genericFetch)

router.post('/queryAll', controller.genericFetchAll)

module.exports = router

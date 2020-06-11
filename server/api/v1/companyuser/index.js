const express = require('express')
const router = express.Router()
const controller = require('./companyuser.controller')
const auth = require('./../../../auth/auth.service')

router.post('/query', auth.isAuthenticated(), controller.genericFetch)

router.post('/queryAll', auth.isAuthenticated(), controller.genericFetchAll)

router.put('/update',
  auth.isAuthenticated(),
  controller.genericUpdate)

module.exports = router

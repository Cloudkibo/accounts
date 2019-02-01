const express = require('express')
const router = express.Router()
const controller = require('./companyuser.controller')
const auth = require('./../../../auth/auth.service')

/*
.....Review Comments......

--> Every endpoint should be authenticated

*/

router.post('/query', auth.isAuthenticated(), controller.genericFetch)

router.post('/queryAll', auth.isAuthenticated(), controller.genericFetchAll)

module.exports = router

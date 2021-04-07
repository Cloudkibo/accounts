const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./companyPreferences.controller')

const auth = require('./../../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer(),
  controller.index)

router.post('/query', 
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer(), 
  controller.genericFetch)

router.post('/',
  validate({body: validationSchema.createPayload}),
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  controller.create)

router.post('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  controller.genericUpdate)

router.get('/scriptPopulateCompPreferences',
  auth.isAuthenticated(),
  controller.populate)

module.exports = router

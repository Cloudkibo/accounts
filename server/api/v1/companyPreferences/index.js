const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./companyPreferences.controller')

const auth = require('./../../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  controller.index)

router.post('/query', 
  auth.isAuthenticated(), 
  controller.genericFetch)

router.post('/',
  validate({body: validationSchema.createPayload}),
  auth.isAuthenticated(),
  controller.create)

router.post('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

router.get('/scriptPopulateCompPreferences',
  auth.isAuthenticated(),
  controller.populate)

module.exports = router

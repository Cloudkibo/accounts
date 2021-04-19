
const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./addOns.controller')
const auth = require('./../../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer(),
  controller.index)

router.post('/',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  validate({body: validationSchema.createPayload}),
  controller.create)

router.post('/query',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer(),
  validate({body: validationSchema.queryPayload}),
  controller.query)

router.put('/',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  validate({body: validationSchema.updatePayload}),
  controller.update)

router.delete('/',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  validate({body: validationSchema.queryPayload}),
  controller.delete)

module.exports = router

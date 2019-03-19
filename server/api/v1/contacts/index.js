const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./contacts.controller')
const auth = require('./../../../auth/auth.service')

router.post('/',
  auth.isAuthenticated(),
  validate({body: validationSchema.create}),
  controller.create)

router.post('/query',
  auth.isAuthenticated(),
  controller.query)

router.post('/aggregate',
  auth.isAuthenticated(),
  controller.aggregate)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

module.exports = router

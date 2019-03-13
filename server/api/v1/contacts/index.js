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
  validate({body: validationSchema.queryPayload}),
  auth.isAuthenticated(),
  controller.query)

module.exports = router

const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate
const auth = require('./../../../auth/auth.service')

const validationSchema = require('./validationSchema')
const controller = require('./pageReferrals.controller')

router.post('/',
  validate({body: validationSchema.createPayload}),
  auth.isAuthenticated(),
  controller.create)

router.post('/query',
  validate({body: validationSchema.queryPayload}),
  auth.isAuthenticated(),
  controller.query)

router.put('/:_id',
  auth.isAuthenticated(),
  controller.update)

router.delete('/:_id',
  auth.isAuthenticated(),
  controller.delete)

module.exports = router

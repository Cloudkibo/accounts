const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./webhooks.controller')
const auth = require('./../../../auth/auth.service')

router.get('/:_id',
  auth.isAuthenticated(),
  controller.index)

router.post('/',
  validate({body: validationSchema.webhookPayload}),
  auth.isAuthenticated(),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.updateWebhookPayload}),
  auth.isAuthenticated(),
  controller.update)

router.delete('/:_id',
  auth.isAuthenticated(),
  controller.delete)

router.post('/query',
  auth.isAuthenticated(),
  controller.query)

router.post('/aggregate',
  auth.isAuthenticated(),
  controller.aggregate)

module.exports = router

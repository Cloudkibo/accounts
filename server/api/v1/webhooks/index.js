const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./webhooks.controller')

router.get('/:_id',
  controller.index)

router.post('/',
  validate({body: validationSchema.webhookPayload}),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.updateWebhookPayload}),
  controller.update)

router.delete('/:_id',
  controller.delete)

router.post('/query',
  controller.query)

router.post('/aggregate',
  controller.aggregate)

module.exports = router

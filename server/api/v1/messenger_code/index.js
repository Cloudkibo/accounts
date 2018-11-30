const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./m_code.controller')
// const auth = require('./../../../auth/auth.service')

router.post('/',
  auth.isAuthenticated(),
  validate({body: validationSchema.createCodePayload}),
  controller.createCode)

router.post('/webhook',
  // auth.isAuthenticated(),
  validate({body: validationSchema.createCodePayload}),
  controller.handleWebhookNotification)

module.exports = router

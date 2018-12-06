const express = require('express')

const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')

const controller = require('./api_settings.controller')
const auth = require('../../../auth/auth.service')

router.post('/',
  validate({body: validationSchema.indexPayload}),
  auth.isAuthenticated(),
  controller.index)

router.post('/enable',
  validate({body: validationSchema.indexPayload}),
  auth.isAuthenticated(),
  controller.enable)

router.post('/disable',
  validate({body: validationSchema.indexPayload}),
  auth.isAuthenticated(),
  controller.disable)

router.post('/reset',
  validate({body: validationSchema.indexPayload}),
  auth.isAuthenticated(),
  controller.reset)

router.post('/query',
  auth.isAuthenticated(),
  controller.genericFetch)

module.exports = router

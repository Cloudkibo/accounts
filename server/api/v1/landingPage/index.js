const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate
const auth = require('./../../../auth/auth.service')

const validationSchema = require('./validationSchema')
const controller = require('./landingPage.controller')

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

router.post('/landingPageState',
  validate({body: validationSchema.createStatePayload}),
  auth.isAuthenticated(),
  controller.createLandingPageState)

router.put('/landingPageState/:_id',
  auth.isAuthenticated(),
  controller.updateLandingPageState)

router.delete('/landingPageState/:_id',
  auth.isAuthenticated(),
  controller.deleteLandingPageState)

module.exports = router

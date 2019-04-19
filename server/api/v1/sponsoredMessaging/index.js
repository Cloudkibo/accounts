  const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate
const auth = require('./../../../auth/auth.service')

const validationSchema = require('./validationSchema')
const controller = require('./sponsoredMessaging.controller')

router.post('/',
  validate({body: validationSchema.createPayload}),
  auth.isAuthenticated(),
  controller.create)

  router.post('/:id',
  validate({body: {}}),
  auth.isAuthenticated(),
  controller.update)

  router.get('/query/:id',
  validate({body: {}}),
  auth.isAuthenticated(),
  controller.findSponsoredMessage
  )


  module.exports = router

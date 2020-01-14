const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./overlayWidgets.controller')
const auth = require('./../../../auth/auth.service')

router.post('/',
  auth.isAuthenticated(),
  validate({body: validationSchema.createPayload}),
  controller.create)

router.post('/query',
  auth.isAuthenticated(),
  controller.query)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

router.post('/aggregate',
  auth.isAuthenticated(),
  controller.aggregate)

router.delete('/:_id',
  auth.isAuthenticated(),
  controller.delete)

module.exports = router

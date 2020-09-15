const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./subscribers.controller')
const auth = require('./../../../auth/auth.service')

router.get('/:_id',
  auth.isAuthenticated(),
  controller.index)

router.post('/',
  validate({body: validationSchema.subscriberPayload}),
  auth.isAuthenticated(),
  controller.create)

router.delete('/:_id',
  auth.isAuthenticated(),
  controller.delete)

router.post('/query',
  validate({body: validationSchema.queryPayload}),
  auth.isAuthenticated(),
  controller.query)

router.post('/aggregate',
  auth.isAuthenticated(),
  controller.aggregate)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

router.get('/updateData',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  controller.updateData)

router.post('/updatePicture',
  auth.isAuthenticated(),
  controller.updatePicture)

module.exports = router

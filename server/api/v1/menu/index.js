const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate
const auth = require('./../../../auth/auth.service')

const validationSchema = require('./validationSchema')
const controller = require('./menu.controller')

router.get('/:_id',
  auth.isAuthenticated(),
  controller.index)

router.post('/',
  validate({body: validationSchema.menuPayload}),
  auth.isAuthenticated(),
  controller.create)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

router.put('/:_id',
  validate({body: validationSchema.updatedMenuPayload}),
  auth.isAuthenticated(),
  controller.update)

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

module.exports = router

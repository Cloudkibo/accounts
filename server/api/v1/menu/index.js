const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./menu.controller')

router.get('/:_id',
  controller.index)

router.post('/',
  validate({body: validationSchema.menuPayload}),
  controller.create)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

router.put('/:_id',
  validate({body: validationSchema.updatedMenuPayload}),
  controller.update)

router.delete('/:_id',
  controller.delete)

router.post('/query',
  controller.query)

router.post('/aggregate',
  controller.aggregate)

module.exports = router

const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./lists.controller')

router.get('/:_id',
  controller.index)

router.post('/',
  validate({body: validationSchema.listPayload}),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.updateListPayload}),
  controller.update)

router.delete('/:_id',
  controller.delete)

router.post('/query',
  controller.query)

router.post('/aggregate',
  controller.aggregate)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

module.exports = router

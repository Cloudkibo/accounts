const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./pages.controller')

router.get('/:_id',
  controller.index)

router.post('/',
  validate({body: validationSchema.pagePayload}),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.pageUpdatePayload}),
  controller.update)

router.delete('/:_id',
  controller.delete)

  router.get('/:_id/connect',
  controller.connect)

  router.get('/:_id/disconnect',
  controller.disconnect)
  

module.exports = router

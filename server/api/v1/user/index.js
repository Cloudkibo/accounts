const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./user.controller')

router.get('/:_id',
  controller.index)

router.post('/',
  validate({body: validationSchema.userPayload}),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.updateUserPayload}),
  controller.update)

router.delete('/:_id',
  controller.delete)

module.exports = router

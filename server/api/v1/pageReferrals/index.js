const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./pageReferrals.controller')

router.post('/',
  validate({body: validationSchema.createPayload}),
  controller.create)

router.post('/query',
  controller.query)

router.put('/:_id',
  controller.update)

router.delete('/:_id',
  controller.delete)

module.exports = router

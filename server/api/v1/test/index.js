const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./test.controller')

router.post('/',
  validate({body: validationSchema.testPayload}),
  controller.index)

module.exports = router

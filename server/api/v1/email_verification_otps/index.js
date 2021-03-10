'use strict'

let express = require('express')
let controller = require('./email_verification_otps.controller')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')

let router = express.Router()

router.post('/',
  validate({ body: validationSchema.create }),
  controller.create)

router.post('/verify',
  validate({ body: validationSchema.verify }),
  controller.verify)

module.exports = router

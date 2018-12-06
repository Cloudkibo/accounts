
'use strict'

let express = require('express')
let controller = require('./passwordresettoken.controller')
let auth = require('./../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
let router = express.Router()

router.post('/change',
  validate({body: validationSchema.updatePasswordSchema}),
  auth.isAuthenticated(),
  controller.change)

router.post('/forgot',
  validate({body: validationSchema.forgotPasswordSchema}),
  controller.forgot)

router.post('/forgotWorkspaceName', controller.forgotWorkspaceName)

router.post('/reset',
  validate({body: validationSchema.resetPasswordSchema}),
  controller.reset)

router.get('/verify/:id', controller.verify)

module.exports = router

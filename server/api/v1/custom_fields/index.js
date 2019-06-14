const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./custom_field.controller')
const auth = require('./../../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  controller.index)
router.post('/',
  auth.isAuthenticated(),
  validate({ body: validationSchema.createPayload }),
  controller.create)
router.post('/query',
  auth.isAuthenticated(),
  validate({ body: validationSchema.queryPayload }),
  controller.query)
router.put('/',
  auth.isAuthenticated(),
  validate({ body: validationSchema.updatePayload }),
  controller.update)
router.delete('/',
  auth.isAuthenticated(() => {
  }),
  validate({ body: validationSchema.deletePayload }),
  controller.delete)

module.exports = router

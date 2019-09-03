const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./comment_capture.controller')
const auth = require('./../../../auth/auth.service')

router.get('/:id',
  auth.isAuthenticated(),
  controller.index)

router.post('/',
  validate({body: validationSchema.postPayload}),
  auth.isAuthenticated(),
  controller.create)

router.delete('/:id',
  auth.isAuthenticated(),
  controller.delete)

router.post('/deleteLocally',
  auth.isAuthenticated(),
  controller.deleteLocally)

router.post('/query',
  auth.isAuthenticated(), controller.genericFetch)

router.post('/aggregate', auth.isAuthenticated(), controller.aggregateFetch)
router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

module.exports = router

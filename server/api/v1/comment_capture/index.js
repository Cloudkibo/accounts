const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./comment_capture.controller')
const auth = require('./../../../auth/auth.service')

/*
Review Comments
--> validate /query request
*/

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

router.post('/query', auth.isAuthenticated(), controller.genericFetch)
router.post('/aggregate', auth.isAuthenticated(), controller.aggregateFetch)
router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

module.exports = router

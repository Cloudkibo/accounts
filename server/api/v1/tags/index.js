'use strict'

var express = require('express')
var controller = require('./tags.controller')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
var router = express.Router()
const auth = require('./../../../auth/auth.service')

router.get('/',
  // auth.isAuthenticated(),
  controller.index)

router.get('/:id',
  // auth.isAuthenticated(),
  controller.findOne)

router.post('/',
  // auth.isAuthenticated(),
  validate({body: validationSchema.createPayload}),
  controller.create)

router.delete('/:id',
  // auth.isAuthenticated(),
  controller.delete)

router.post('/query',
  // auth.isAuthenticated(),
  controller.query)

router.post('/aggregate',
  // auth.isAuthenticated(),
  controller.aggregate)

router.put('/update',
  // auth.isAuthenticated(),
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

router.post('/deleteMany',
  // auth.isAuthenticated(),
  controller.deleteMany)

module.exports = router

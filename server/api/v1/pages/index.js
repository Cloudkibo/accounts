const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./pages.controller')
const auth = require('./../../../auth/auth.service')

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

router.get('/:_id/greetingText',
  controller.getGreetingText)

router.put('/:_id/greetingText',
  validate({body: validationSchema.updateGreetingText}),
  auth.isAuthenticated(),
  controller.setGreetingText)

router.post('/query',
  controller.query)

router.post('/aggregate',
  controller.aggregate)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

router.get('/whitelistDomain/:_id',
  auth.isAuthenticated(),
  controller.fetchWhitelistedDomains)

router.post('/whitelistDomain',
  auth.isAuthenticated(),
  validate({body: validationSchema.whiteListPayload}),
  controller.whitelistDomain)

router.post('/deleteWhitelistDomain',
  auth.isAuthenticated(),
  validate({body: validationSchema.deleteWhitelistDomain}),
  controller.deleteWhitelistDomain)

module.exports = router

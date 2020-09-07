const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./pages.controller')
const auth = require('./../../../auth/auth.service')
const attachBuyerInfo = require('./../../global/utility').attachBuyerInfo

router.get('/:_id',
  auth.isAuthenticated(),
  controller.index)

router.post('/refreshPages',
  auth.isAuthenticated(),
  controller.refreshPages)

router.post('/',
  validate({body: validationSchema.pagePayload}),
  auth.isAuthenticated(),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.pageUpdatePayload}),
  auth.isAuthenticated(),
  controller.update)

router.delete('/:_id',
  auth.isAuthenticated(),
  controller.delete)

router.get('/:_id/connect',
  auth.isAuthenticated(),
  controller.connect)

router.get('/:_id/disconnect',
  auth.isAuthenticated(),
  controller.disconnect)

router.get('/:_id/greetingText',
  auth.isAuthenticated(),
  controller.getGreetingText)

router.put('/:_id/greetingText',
  validate({body: validationSchema.updateGreetingText}),
  auth.isAuthenticated(),
  controller.setGreetingText)

router.post('/query',
  validate({body: validationSchema.queryPayload}),
  auth.isAuthenticated(),
  controller.query)

router.post('/aggregate',
  auth.isAuthenticated(),
  controller.aggregate)

router.post('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

router.get('/whitelistDomain/:_id',
  auth.isAuthenticated(),
  attachBuyerInfo(),
  controller.fetchWhitelistedDomains)

router.post('/whitelistDomain',
  auth.isAuthenticated(),
  validate({body: validationSchema.whiteListPayload}),
  attachBuyerInfo(),
  controller.whitelistDomain)

router.post('/deleteWhitelistDomain',
  auth.isAuthenticated(),
  validate({body: validationSchema.deleteWhitelistDomain}),
  attachBuyerInfo(),
  controller.deleteWhitelistDomain)

router.get('/script/updatePageNames', controller.updatePageNames)

module.exports = router

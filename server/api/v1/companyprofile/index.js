const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const config = require('./../../../config/environment/index')
const validationSchema = require('./validationSchema')
const controller = require('./companyprofile.controller')
const StripeWebhook = require('stripe-webhook-middleware')
const stripeEvents = require('./stripeEvents')

const auth = require('./../../../auth/auth.service')

var stripeWebhook = new StripeWebhook({
  stripeApiKey: config.stripeOptions.apiKey,
  respond: true
})

router.get('/',
  auth.isAuthenticated(),
  controller.index)

router.get('/switchToBasicPlan',
  auth.isAuthenticated(),
  controller.switchToBasicPlan)

router.post('/invite',
  validate({body: validationSchema.invitePayload}),
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  controller.invite)

router.post('/updateRole',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  controller.updateRole)

router.post('/disableMember',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  validate({body: validationSchema.disableMember}),
  controller.disableMember)

router.get('/members',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer(),
  controller.members)

router.post('/updateAutomatedOptions',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  validate({body: validationSchema.updateAutomatedOptions}),
  controller.updateAutomatedOptions)

router.post('/setCard',
  auth.isAuthenticated(),
  validate({body: validationSchema.setCard}),
  controller.setCard)

router.post('/updatePlan',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  validate({body: validationSchema.updatePlan}),
  controller.updatePlan)

router.get('/getAutomatedOptions',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer(),
  controller.getAutomatedOptions)

router.get('/getKeys',
  auth.isAuthenticated(),
  controller.getKeys)

// use this url to receive stripe webhook events
router.post('/stripe/events',
  auth.isAuthenticated(),
  auth.isSuperUserActingAsCustomer('write'),
  stripeWebhook.middleware,
  stripeEvents
)

router.post('/query',
  auth.isAuthenticated(),
  controller.genericFetch)

router.post('/aggregate', 
  auth.isAuthenticated(),
  controller.aggregateFetch)

router.put('/update',
  auth.isAuthenticated(),
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

module.exports = router

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

router.post('/invite',
  validate({body: validationSchema.invitePayload}),
  auth.isAuthenticated(),
  controller.invite)

router.post('/updateRole',
  validate({body: validationSchema.updateRole}),
  auth.isAuthenticated(),
  controller.updateRole)

router.post('/removeMember',
  validate({body: validationSchema.removeMember}),
  auth.isAuthenticated(),
  controller.removeMember)

router.get('/members',
  auth.isAuthenticated(),
  auth.isAuthenticated(),
  controller.members)

router.post('/updateAutomatedOptions',
  validate({body: validationSchema.updateAutomatedOptions}),
  auth.isAuthenticated(),
  controller.updateAutomatedOptions)

router.get('/addPlanID',
  auth.isAuthenticated(),
  controller.addPlanID)

router.post('/setCard',
  validate({body: validationSchema.setCard}),
  auth.isAuthenticated(),
  controller.setCard)

router.post('/updatePlan',
  validate({body: validationSchema.updatePlan}),
  auth.isAuthenticated(),
  controller.updatePlan)

router.get('/getAutomatedOptions',
  auth.isAuthenticated(),
  controller.getAutomatedOptions)

router.get('/getKeys',
  auth.isAuthenticated(),
  controller.getKeys)

// use this url to receive stripe webhook events
router.post('/stripe/events',
  stripeWebhook.middleware,
  auth.isAuthenticated(),
  stripeEvents
)

router.post('/query', controller.genericFetch)
router.post('/aggregate', controller.aggregateFetch)
router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

module.exports = router

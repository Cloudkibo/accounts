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
  controller.index)

router.post('/invite',
  validate({body: validationSchema.invitePayload}),
  controller.invite)

router.post('/updateRole',
  validate({body: validationSchema.updateRole}),
  controller.updateRole)

router.post('/removeMember',
  validate({body: validationSchema.removeMember}),
  controller.removeMember)

router.get('/members',
  auth.isAuthenticated(),
  controller.members)

router.post('/updateAutomatedOptions',
  validate({body: validationSchema.updateAutomatedOptions}),
  controller.updateAutomatedOptions)

router.get('/addPlanID', controller.addPlanID)
router.post('/setCard',
  validate({body: validationSchema.setCard}),
  controller.setCard)

router.post('/updatePlan',
  validate({body: validationSchema.updatePlan}),
  controller.updatePlan)

router.get('/getAutomatedOptions',
  controller.getAutomatedOptions)

router.get('/getKeys', controller.getKeys)

// use this url to receive stripe webhook events
router.post('/stripe/events',
  stripeWebhook.middleware,
  stripeEvents
)

router.post('/query', controller.genericFetch)
router.post('/aggregate', controller.aggregateFetch)
router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

module.exports = router

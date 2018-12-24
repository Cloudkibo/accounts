const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./landingPage.controller')

router.post('/',
  validate({body: validationSchema.createPayload}),
  controller.create)

router.post('/query',
  controller.query)

router.put('/:_id',
  controller.update)

router.delete('/:_id',
  controller.delete)

router.post('/landingPageState',
  validate({body: validationSchema.createStatePayload}),
  controller.createLandingPageState)

router.put('/landingPageState/:_id',
  controller.updateLandingPageState)

router.delete('/landingPageState/:_id',
  controller.deleteLandingPageState)

module.exports = router

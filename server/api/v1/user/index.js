const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./user.controller')

router.get('/:_id', controller.index)
router.post('/updateChecks', controller.updateChecks)
router.get('/updateSkipConnect', controller.updateSkipConnect)
router.get('/fbAppId', controller.fbAppId)
router.get('/addAccountType', controller.addAccountType)

router.post('/authenticatePassword',
  validate({body: validationSchema.authenticatePassword}),
  controller.authenticatePassword)

router.post('/updateMode',
  validate({body: validationSchema.updateMode}),
  controller.updateMode)

router.post('/joinCompany',
  validate({body: validationSchema.joinCompany}),
  controller.joinCompany)

router.post('/',
  validate({body: validationSchema.userPayload}),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.updateUserPayload}),
  controller.update)

router.delete('/:_id',
  controller.delete)

router.post('/:_id/gdpr',
  validate({body: validationSchema.enableGDPRDelete}),
  controller.enableDelete)

router.delete('/:_id/gdpr',
  controller.cancelDeletion)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

module.exports = router

const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./user.controller')
const auth = require('./../../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/updateChecks', auth.isAuthenticated(), controller.updateChecks)
router.get('/updateSkipConnect', auth.isAuthenticated(), controller.updateSkipConnect)
router.get('/fbAppId', auth.isAuthenticated(), controller.fbAppId)
router.get('/addAccountType', controller.addAccountType)

router.post('/authenticatePassword',
  validate({body: validationSchema.authenticatePassword}),
  auth.isAuthenticated(),
  controller.authenticatePassword)

router.post('/markAccountAsDisabled',
  auth.isAuthorizedSuperUser(),
  controller.markAccountAsDisabled)

router.post('/updateMode',
  validate({body: validationSchema.updateMode}),
  auth.isAuthenticated(),
  controller.updateMode)

router.post('/joinCompany',
  validate({body: validationSchema.joinCompany}),
  controller.joinCompany)

router.post('/',
  validate({body: validationSchema.userPayload}),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.updateUserPayload}),
  auth.isAuthenticated(),
  controller.update)

router.delete('/:_id',
  auth.isAuthenticated(),
  controller.delete)

router.post('/gdpr',
  validate({body: validationSchema.enableGDPRDelete}),
  auth.isAuthenticated(),
  controller.enableDelete)

router.get('/gdpr',
  auth.isAuthenticated(),
  controller.cancelDeletion)

router.post('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

router.post('/query',
  auth.isAuthenticated(),
  controller.fetchGeneral)

router.get('/updatePicture',
  auth.isAuthenticated(),
  controller.updatePicture)

router.post('/aggregate',
  auth.isAuthenticated(),
  controller.aggregate)

router.post('/distinct',
  auth.isAuthenticated(),
  controller.distinct)

module.exports = router

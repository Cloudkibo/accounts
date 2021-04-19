const express = require('express')
const router = express.Router()
const controller = require('./plans.controller')
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')

router.get('/', auth.isAuthorizedSuperUser(), controller.index)

router.post('/',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.createPayload}),
  controller.create)

router.put('/',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.updatePayload}),
  controller.update)

router.delete('/:id', auth.isAuthorizedSuperUser(), controller.delete)

router.post('/changeDefaultPlan',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.changeDefaultPlan}),
  controller.changeDefaultPlan)

router.post('/migrateCompanies',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.migrateCompanies}),
  controller.migrateCompanies)

router.post('/populate', controller.populatePlan)

router.get('/',
  auth.isAuthorizedSuperUser(),
  controller.fetchAll)

router.post('/query', auth.isAuthenticated(), controller.genericFetch)

module.exports = router

const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./usage.controller')
const auth = require('./../../../auth/auth.service')

router.get('/populatePlanUsage', controller.populatePlanUsage)
router.get('/populateCompanyUsage', controller.populateCompanyUsage)

router.get('/:id',
  controller.index)

router.post('/createPlanUsage',
  controller.createPlanUsage)

router.post('/createCompanyUsage',
  controller.createCompanyUsage)

router.post('/planQuery',
  auth.isAuthenticated(),
  controller.fetchGeneralPlanUsage)

router.post('/companyQuery',
  auth.isAuthenticated(),
  controller.fetchGeneralCompanyUsage)

router.put('/updateCompany',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdateCompany)

module.exports = router

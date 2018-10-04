const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./usage.controller')

router.get('/populatePlanUsage', controller.populatePlanUsage)
router.get('/populateCompanyUsage', controller.populateCompanyUsage)

router.get('/:id',
  controller.index)

router.post('/createPlanUsage',
  controller.createPlanUsage)

router.post('/createCompanyUsage',
  controller.createCompanyUsage)

router.put('/:id',
  validate({body: validationSchema.updatePostPayload}),
  controller.update)

module.exports = router

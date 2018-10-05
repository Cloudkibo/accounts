const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./permissions_plan.controller')

router.get('/:_id',
  controller.index)

router.post('/',
  validate({body: validationSchema.permissionPlanPayload}),
  controller.create)

router.put('/:_id',
  validate({body: validationSchema.updatePermissionPlanPayload}),
  controller.update)

router.delete('/:_id',
  controller.delete)

router.post('/query',
  controller.query)

router.post('/aggregate',
  controller.aggregate)

module.exports = router

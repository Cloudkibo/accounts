const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./companyprofile.controller')

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

router.get('/getAutomatedOptions',
  controller.getAutomatedOptions)

router.post('/query', controller.genericFetch)
router.post('/aggregate', controller.aggregateFetch)
router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

module.exports = router

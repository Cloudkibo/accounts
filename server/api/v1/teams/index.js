const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./teams.controller')
const agentController = require('./team_agents.controller')
const pageController = require('./team_pages.controller')

router.get('/', controller.index)
router.get('/:id', controller.findOne)
router.delete('/:id', controller.delete)
router.post('/',
  validate({body: validationSchema.teamPayload}),
  controller.create)
router.put('/:id',
  validate({body: validationSchema.teamUpdatePayload}),
  controller.update)

router.get('/agents', agentController.index)
router.post('/agents', validate({body: validationSchema.agentPayload}), agentController.create)
router.delete('/agents', validate({body: validationSchema.agentPayload}), agentController.delete)

router.get('/pages', pageController.index)
router.post('/pages', validate({body: validationSchema.pagePayload}), pageController.create)
router.delete('/pages', validate({body: validationSchema.pagePayload}), pageController.delete)

module.exports = router

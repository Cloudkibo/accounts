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
// Generic query endpoint
router.post('/query', controller.genericTeamFetch)
router.post('/aggregate', controller.aggregateTeamFetch)

router.get('/agents', agentController.index)
router.post('/agents', validate({body: validationSchema.agentPayload}), agentController.create)
router.delete('/agents', validate({body: validationSchema.agentPayload}), agentController.delete)
// Generic query endpoint
router.post('/agents/query', agentController.genericAgentsFetch)
router.post('/agents/aggregate', agentController.aggregateAgentsFetch)

router.get('/pages', pageController.index)
router.post('/pages', validate({body: validationSchema.pagePayload}), pageController.create)
router.delete('/pages', validate({body: validationSchema.pagePayload}), pageController.delete)
// Generic query endpoint
router.post('/pages/query', pageController.genericPagesFetch)
router.post('/pages/aggregate', pageController.aggregatePagesFetch)

module.exports = router

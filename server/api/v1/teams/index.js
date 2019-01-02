const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./teams.controller')
const agentController = require('./team_agents.controller')
const pageController = require('./team_pages.controller')
const auth = require('./../../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.get('/:id', auth.isAuthenticated(), controller.findOne)
router.delete('/delete/:id', auth.isAuthenticated(), controller.delete)
router.post('/',
  validate({body: validationSchema.teamPayload}),
  auth.isAuthenticated(),
  controller.create)
router.put('/:id',
  validate({body: validationSchema.teamUpdatePayload}),
  auth.isAuthenticated(),
  controller.update)
// Generic query endpoint
router.post('/query', auth.isAuthenticated(), controller.genericTeamFetch)
router.post('/aggregate', auth.isAuthenticated(), controller.aggregateTeamFetch)
router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

router.get('/agents', auth.isAuthenticated(), agentController.index)
router.post('/agents',
  validate({body: validationSchema.agentPayload}),
  auth.isAuthenticated(),
  agentController.create)
router.delete('/agents',
  validate({body: validationSchema.agentPayload}),
  auth.isAuthenticated(),
  agentController.deleteAgent)
// Generic query endpoint
router.post('/agents/query', auth.isAuthenticated(), agentController.genericAgentsFetch)
router.post('/agents/distinct', auth.isAuthenticated(), agentController.distinctAgentsFetch)
router.post('/agents/aggregate', auth.isAuthenticated(), agentController.aggregateAgentsFetch)
router.put('/agents/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  agentController.genericUpdate)

router.get('/pages', auth.isAuthenticated(), pageController.index)
router.post('/pages',
  validate({body: validationSchema.pagePayload}),
  auth.isAuthenticated(),
  pageController.create)
router.delete('/pages',
  validate({body: validationSchema.pagePayload}),
  auth.isAuthenticated(),
  pageController.delete)
// Generic query endpoint
router.post('/pages/query', auth.isAuthenticated(), pageController.genericPagesFetch)
router.post('/pages/distinct', auth.isAuthenticated(), pageController.distinctPagesFetch)
router.post('/pages/aggregate', auth.isAuthenticated(), pageController.aggregatePagesFetch)
router.put('/pages/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  pageController.genericUpdate)

module.exports = router

const express = require('express')
const router = express.Router()
const controller = require('./webhooks.controller')

router.get('/:_id',
  controller.index)

router.post('/',
  controller.create)

router.put('/:_id',
  controller.update)

router.delete('/:_id',
  controller.delete)

router.post('/query',
  controller.query)

router.post('/aggregate',
  controller.aggregate)

module.exports = router

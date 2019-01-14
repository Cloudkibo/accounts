const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./comment_capture.controller')

router.get('/:id',
  controller.index)

router.post('/',
  validate({body: validationSchema.postPayload}),
  controller.create)

router.delete('/:id',
  controller.delete)

router.post('/query', controller.genericFetch)
router.post('/aggregate', controller.aggregateFetch)
router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  controller.genericUpdate)

module.exports = router

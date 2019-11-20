const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./comment_capture.controller')
const commentController = require('./comments.controller')
const auth = require('./../../../auth/auth.service')

router.get('/:id',
  auth.isAuthenticated(),
  controller.index)

router.get('/script/normalize',
  controller.scriptNormalizeAnalytics)

router.post('/',
  validate({body: validationSchema.postPayload}),
  auth.isAuthenticated(),
  controller.create)

router.delete('/:id',
  auth.isAuthenticated(),
  controller.delete)

router.post('/deleteLocally',
  auth.isAuthenticated(),
  controller.deleteLocally)

router.post('/query',
  auth.isAuthenticated(), controller.genericFetch)

router.post('/aggregate', auth.isAuthenticated(), controller.aggregateFetch)

router.put('/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.genericUpdate)

router.put('/updateone',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  controller.update)

router.post('/upload',
  auth.isAuthenticated(),
  controller.upload)


router.post('/comments',
  validate({body: validationSchema.commentPayload}),
  auth.isAuthenticated(),
  commentController.create)

router.post('/comments/delete',
  auth.isAuthenticated(),
  commentController.delete)

router.post('/comments/query',
  auth.isAuthenticated(),
  commentController.genericFetch)

router.post('/comments/aggregate',
  auth.isAuthenticated(),
  commentController.aggregateFetch)

router.put('/comments/update',
  validate({body: validationSchema.genericUpdatePayload}),
  auth.isAuthenticated(),
  commentController.genericUpdate)


module.exports = router

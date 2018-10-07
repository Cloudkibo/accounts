const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./permissions.controller')

router.get('/:role',
  controller.index) // get role permissions

router.put('/:id',
  validate({body: validationSchema.updateUserPermissionsPayload}),
  controller.updatePermissions) // update user permissions

router.post('/update',
  validate({body: validationSchema.updateRolePermissionPayload}),
  controller.update) // update role permission

router.post('/create',
  validate({body: validationSchema.createRolePermissionPayload}),
  controller.create) // update role permission

router.get('/populateRolePermissions',
  controller.populateRolePermissions) // populate role permissions

router.post('/query',
  controller.genericFind) // generic find

module.exports = router

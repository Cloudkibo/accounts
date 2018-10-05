const express = require('express')
const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./permissions.controller')

router.get('/:role',
  controller.index) // get role permissions

router.post('/update',
  validate({body: validationSchema.updateRolePermissionPayload}),
  controller.update) // update role permission

router.post('/rolePermission/aggregate',
  controller.roleAggregate) // aggregate role permissions

router.post('/aggregate',
  controller.aggregate) // aggregate user permissions

router.get('/populateRolePermissions',
  controller.populateRolePermissions) // populate role permissions

router.get('/generic',
  controller.genericFind) // generic find

router.get('/updatePermissions',
  controller.updatePermissions) // update user permissions

module.exports = router

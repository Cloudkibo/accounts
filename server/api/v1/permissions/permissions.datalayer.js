/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const RolePermissionsModel = require('./rolePermissions.model')
const UserPermissionsModel = require('./permissions.model')

exports.findOneRolePermissionObject = (role) => {
  return RolePermissionsModel.findOne({role})
    .exec()
}

exports.savePermissionObject = (object) => {
  return object.save()
}

exports.roleAggregate = (aggregateObject) => {
  return RolePermissionsModel.aggregate(aggregateObject)
    .then()
}

exports.aggregate = (aggregateObject) => {
  return UserPermissionsModel.aggregate(aggregateObject)
    .then()
}

exports.genericFindUserPermissions = (query) => {
  return UserPermissionsModel.find(query)
    .exec()
}

exports.updateUserPermissionsObject = (query, object) => {
  return UserPermissionsModel.updateOne(query, object)
    .exec()
}

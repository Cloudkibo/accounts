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

exports.createUserPermission = (payload) => {
  let obj = new UserPermissionsModel(payload)
  return obj.save()
}

exports.updatUserPermissionsObjectUsingQuery = (query, update, options) => {
  return UserPermissionsModel.update(query, update, options)
    .exec()
}

exports.savePermissionObject = (object) => {
  let obj = new RolePermissionsModel(object)
  return obj.save()
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
  return UserPermissionsModel.find(query).populate('userId')
    .exec()
}

exports.findOneUserPermissionsUsingQUery = (query) => {
  return UserPermissionsModel.findOne(query)
    .exec()
}

exports.updateUserPermissionsObject = (query, object) => {
  return UserPermissionsModel.updateOne(query, object)
    .exec()
}

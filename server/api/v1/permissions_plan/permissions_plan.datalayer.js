/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const PermissionsPlan = require('./Permissions_Plan.model')

exports.findOnePermissionsPlanObject = (permissionsPlanId) => {
  return PermissionsPlan.findOne({_id: permissionsPlanId})
    .populate('plan_id')
    .exec()
}

exports.findallPermissionsPlanObjects = (query) => {
  return PermissionsPlan.find(query)
    .populate('plan_id')
    .exec()
}

exports.findOnePermissionObjectUsingQuery = (query) => {
  return PermissionsPlan.findOne(query)
    .populate('plan_id')
    .exec()
}

exports.aggregateInfo = (query) => {
  return PermissionsPlan.aggregate(query)
    .exec()
}

exports.createPermissionsPlanObject = (payload) => {
  let obj = new PermissionsPlan(payload)
  return obj.save()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updatePermissionsPlanObject = (permissionsPlanId, payload) => {
  return PermissionsPlan.updateOne({_id: permissionsPlanId}, payload)
    .exec()
}

exports.deletePermissionsPlanObject = (permissionsPlanId) => {
  return PermissionsPlan.deleteOne({_id: permissionsPlanId})
    .exec()
}

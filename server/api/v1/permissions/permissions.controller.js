const logger = require('../../../components/logger')
const logicLayer = require('./permissions.logiclayer')
const dataLayer = require('./permissions.datalayer')
const TAG = '/api/v1/permissions/permissions.controller.js'
const utility = require('../../../components/utility.js')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the permissions controller index to get role permissions')

  dataLayer.findOneRolePermissionObject(req.params.role)
    .then(permissions => {
      return res.status(200).json({status: 'success', payload: permissions})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the permissions controller index to update role permissions')

  dataLayer.findOneRolePermissionObject(req.body.role)
    .then(permissions => {
      permissions = utility.prepareUpdatePayload(permissions, req.body, 'role')
      dataLayer.savePermissionObject(permissions)
        .then(updatedPermission => {
          return res.status(200).json({status: 'success', payload: 'Permissions have been updated successfully!'})
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.create = function (req, res) {
  let query = logicLayer.getAddPermissionObject(req.body)
  dataLayer.roleAggregate([{$addFields: query}, {$out: 'role_permissions'}])
    .then(RolePermissions => {
      dataLayer.aggregate([{$addFields: query}, {$out: 'permissions'}])
        .then(permissions => {
          return res.status(200).json({status: 'success', payload: 'Permission has been added successfully!'})
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.populateRolePermissions = function (req, res) {
  let buyerPermissions = logicLayer.getBuyerPermissionsPayload()
  dataLayer.savePermissionObject(buyerPermissions)
    .then(savedBuyerPermission => {
      let adminPermissions = logicLayer.getAdminPermissionsPayload()
      dataLayer.savePermissionObject(adminPermissions)
        .then(savedAdminPermissions => {
          let agentPermissions = logicLayer.getAgentPermissionsPayload()
          dataLayer.savePermissionObject(agentPermissions)
            .then(savedAgentPermissions => {
              return res.status(200).json({status: 'success', payload: 'Successfuly populated!'})
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: err})
            })
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: err})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.genericFind = function (req, res) {
  dataLayer.genericFindUserPermissions(req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.updatePermissions = function (req, res) {
  dataLayer.updateUserPermissionsObject({_id: req.params.id}, req.body)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

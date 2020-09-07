const logger = require('../../../components/logger')
const logicLayer = require('./permissions.logiclayer')
const dataLayer = require('./permissions.datalayer')
const TAG = '/api/v1/permissions/permissions.controller.js'
const utility = require('../../../components/utility.js')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the permissions controller index to get role permissions')

  dataLayer.findOneRolePermissionObject(req.params.role)
    .then(permissions => {
      sendSuccessResponse(res, 200, permissions)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the permissions controller index to update role permissions')

  dataLayer.findOneRolePermissionObject(req.body.role)
    .then(permissions => {
      permissions = utility.prepareUpdatePayload(permissions, req.body, 'role')
      dataLayer.savePermissionObject(permissions)
        .then(updatedPermission => {
          sendSuccessResponse(res, 200, 'Permissions have been updated successfully!')
        })
        .catch(err => {
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'Hit the permissions controller index to update permission')

  dataLayer.updatUserPermissionsObjectUsingQuery(req.body.query, req.body.newPayload, req.body.options)
    .then(permissions => {
        sendSuccessResponse(res, 200, 'Permissions have been updated successfully!')
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  let query = logicLayer.getAddPermissionObject(req.body)
  dataLayer.roleAggregate([{$addFields: query}, {$out: 'role_permissions'}])
    .then(RolePermissions => {
      dataLayer.aggregate([{$addFields: query}, {$out: 'permissions'}])
        .then(permissions => {
          sendSuccessResponse(res, 200, 'Permission has been added successfully!')
        })
        .catch(err => {
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
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
              sendSuccessResponse(res, 200, 'Successfuly populated!')
            })
            .catch(err => {
              sendErrorResponse(res, 500, err)
            })
        })
        .catch(err => {
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFind = function (req, res) {
  dataLayer.genericFindUserPermissions(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.updatePermissions = function (req, res) {
  dataLayer.updateUserPermissionsObject({_id: req.params.id}, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

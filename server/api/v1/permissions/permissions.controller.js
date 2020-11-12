const logger = require('../../../components/logger')
const logicLayer = require('./permissions.logiclayer')
const dataLayer = require('./permissions.datalayer')
const TAG = '/api/v1/permissions/permissions.controller.js'
const utility = require('../../../components/utility.js')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {

  dataLayer.findOneRolePermissionObject(req.params.role)
    .then(permissions => {
      sendSuccessResponse(res, 200, permissions)
    })
    .catch(err => {
      const message = err || 'Failed to fetch Role Permission '
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  dataLayer.findOneRolePermissionObject(req.body.role)
    .then(permissions => {
      permissions = utility.prepareUpdatePayload(permissions, req.body, 'role')
      dataLayer.savePermissionObject(permissions)
        .then(updatedPermission => {
          sendSuccessResponse(res, 200, 'Permissions have been updated successfully!')
        })
        .catch(err => {
          const message = err || 'Failed to update Permission '
          logger.serverLog(message, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to fetch Role Permission '
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.updatUserPermissionsObjectUsingQuery(req.body.query, req.body.newPayload, req.body.options)
    .then(permissions => {
        sendSuccessResponse(res, 200, 'Permissions have been updated successfully!')
    })
    .catch(err => {
      const message = err || 'Failed to update Role Permission '
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
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
          const message = err || 'Failed to Add Permission '
          logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to Add Role Permission '
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
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
              const message = err || 'Failed to Save agent Role Permission '
              logger.serverLog(message, `${TAG}: exports.populateRolePermissions`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
              sendErrorResponse(res, 500, err)
            })
        })
        .catch(err => {
          const message = err || 'Failed to Save admin Role Permission '
          logger.serverLog(message, `${TAG}: exports.populateRolePermissions`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to Save Buyer Role Permission '
      logger.serverLog(message, `${TAG}: exports.populateRolePermissions`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFind = function (req, res) {
  dataLayer.genericFindUserPermissions(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to Find UserPermissions '
      logger.serverLog(message, `${TAG}: exports.genericFind`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.updatePermissions = function (req, res) {
  dataLayer.updateUserPermissionsObject({_id: req.params.id}, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update  User Permissions '
      logger.serverLog(message, `${TAG}: exports.updatePermissions`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

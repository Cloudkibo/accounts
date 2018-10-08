/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.updateRolePermissionPayload = {
  type: 'object',
  properties: {
    role: {
      type: 'string',
      required: true
    }
  }
}

exports.updateUserPermissionsPayload = {
  type: 'object',
  properties: {
    apiPermission: {
      type: 'string'
    },
    surveyPermission: {
      type: 'string'
    },
    subscriberPermission: {
      type: 'string'
    },
    pollsPermission: {
      type: 'string'
    },
    pagesPermission: {
      type: 'string'
    },
    pagesAccessPermission: {
      type: 'string'
    },
    menuPermission: {
      type: 'string'
    },
    livechatPermission: {
      type: 'string'
    },
    autopostingPermission: {
      type: 'string'
    },
    broadcastPermission: {
      type: 'string'
    },
    invitationsPermission: {
      type: 'string'
    },
    deleteAgentPermission: {
      type: 'string'
    },
    inviteAgentPermission: {
      type: 'string'
    },
    updateRolePermission: {
      type: 'string'
    },
    deleteAdminPermission: {
      type: 'string'
    },
    inviteAdminPermission: {
      type: 'string'
    },
    membersPermission: {
      type: 'string'
    },
    companyUpdatePermission: {
      type: 'string'
    },
    companyPermission: {
      type: 'string'
    },
    dashboardPermission: {
      type: 'string'
    },
    customerMatchingPermission: {
      type: 'string'
    },
    terminateService: {
      type: 'string'
    },
    upgradeService: {
      type: 'string'
    },
    downgradeService: {
      type: 'string'
    },
    billingPermission: {
      type: 'string'
    }
  },
  required: [
    'apiPermission',
    'surveyPermission',
    'subscriberPermission',
    'pollsPermission',
    'pagesPermission',
    'pagesAccessPermission',
    'menuPermission',
    'livechatPermission',
    'autopostingPermission',
    'broadcastPermission',
    'invitationsPermission',
    'deleteAgentPermission',
    'inviteAgentPermission',
    'updateRolePermission',
    'deleteAdminPermission',
    'inviteAdminPermission',
    'membersPermission',
    'companyUpdatePermission',
    'companyPermission',
    'dashboardPermission',
    'customerMatchingPermission',
    'terminateService',
    'upgradeService',
    'downgradeService',
    'billingPermission'
  ]
}

/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

exports.getBuyerPermissionsPayload = () => {
  let buyerPermissions = {
    role: 'buyer',
    billingPermission: true,
    downgradeService: true,
    upgradeService: true,
    terminateService: true,
    customerMatchingPermission: true,
    dashboardPermission: true,
    companyPermission: true,
    companyUpdatePermission: true,
    membersPermission: true,
    inviteAdminPermission: true,
    deleteAdminPermission: true,
    updateRolePermission: true,
    inviteAgentPermission: true,
    deleteAgentPermission: true,
    invitationsPermission: true,
    broadcastPermission: true,
    autopostingPermission: true,
    livechatPermission: true,
    menuPermission: true,
    pagesAccessPermission: true,
    pagesPermission: true,
    pollsPermission: true,
    subscriberPermission: true,
    surveyPermission: true,
    apiPermission: true
  }
  return buyerPermissions
}

exports.getAdminPermissionsPayload = () => {
  let adminPermissions = {
    role: 'admin',
    billingPermission: false,
    downgradeService: false,
    upgradeService: false,
    terminateService: false,
    customerMatchingPermission: true,
    dashboardPermission: true,
    companyPermission: true,
    companyUpdatePermission: false,
    membersPermission: true,
    inviteAdminPermission: true,
    deleteAdminPermission: true,
    promoteToAdminPermission: true,
    inviteAgentPermission: true,
    deleteAgentPermission: true,
    updateRolePermission: true,
    invitationsPermission: true,
    broadcastPermission: true,
    autopostingPermission: true,
    livechatPermission: true,
    menuPermission: true,
    pagesAccessPermission: true,
    pagesPermission: true,
    pollsPermission: true,
    subscriberPermission: true,
    surveyPermission: true,
    apiPermission: false
  }
  return adminPermissions
}

exports.getAgentPermissionsPayload = () => {
  let agentPermissions = {
    role: 'agent',
    billingPermission: false,
    downgradeService: false,
    upgradeService: false,
    terminateService: false,
    customerMatchingPermission: false,
    dashboardPermission: true,
    companyPermission: true,
    companyUpdatePermission: false,
    membersPermission: true,
    inviteAdminPermission: false,
    deleteAdminPermission: false,
    updateRolePermission: false,
    inviteAgentPermission: false,
    deleteAgentPermission: false,
    invitationsPermission: false,
    broadcastPermission: true,
    autopostingPermission: true,
    livechatPermission: true,
    menuPermission: true,
    pagesAccessPermission: true,
    pagesPermission: false,
    pollsPermission: true,
    subscriberPermission: true,
    surveyPermission: true,
    apiPermission: false
  }
  return agentPermissions
}

exports.preparePermissionsPayloadForUpdate = (payload) => {
  let permissions = {
    apiPermission: payload.apiPermission,
    surveyPermission: payload.surveyPermission,
    subscriberPermission: payload.subscriberPermission,
    pollsPermission: payload.pollsPermission,
    pagesPermission: payload.pagesPermission,
    pagesAccessPermission: payload.pagesAccessPermission,
    menuPermission: payload.menuPermission,
    livechatPermission: payload.livechatPermission,
    autopostingPermission: payload.autopostingPermission,
    broadcastPermission: payload.broadcastPermission,
    invitationsPermission: payload.invitationsPermission,
    deleteAgentPermission: payload.deleteAgentPermission,
    inviteAgentPermission: payload.inviteAgentPermission,
    updateRolePermission: payload.updateRolePermission,
    deleteAdminPermission: payload.deleteAdminPermission,
    inviteAdminPermission: payload.inviteAdminPermission,
    membersPermission: payload.membersPermission,
    companyUpdatePermission: payload.companyUpdatePermission,
    companyPermission: payload.companyPermission,
    dashboardPermission: payload.dashboardPermission,
    customerMatchingPermission: payload.customerMatchingPermission,
    terminateService: payload.terminateService,
    upgradeService: payload.upgradeService,
    downgradeService: payload.downgradeService,
    billingPermission: payload.billingPermission
  }
  return permissions
}

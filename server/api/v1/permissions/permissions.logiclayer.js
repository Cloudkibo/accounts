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

exports.getAddPermissionObject = (body) => {
  var temp = body.name.split(' ')
  for (var i = 1; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }
  var permission = temp.toString().replace(new RegExp(',', 'g'), '')
  let query = {}
  query[permission] = false
  return query
}

/**
 * Created by imran on 11/07/2018.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let RolePermissionsSchema = new Schema({
  role: String,
  billingPermission: Boolean,
  downgradeService: Boolean,
  upgradeService: Boolean,
  terminateService: Boolean,
  customerMatchingPermission: Boolean,
  dashboardPermission: Boolean,
  companyPermission: Boolean,
  companyUpdatePermission: Boolean,
  membersPermission: Boolean,
  inviteAdminPermission: Boolean,
  deleteAdminPermission: Boolean,
  updateRolePermission: Boolean,
  inviteAgentPermission: Boolean,
  deleteAgentPermission: Boolean,
  invitationsPermission: Boolean,
  broadcastPermission: Boolean,
  autopostingPermission: Boolean,
  livechatPermission: Boolean,
  menuPermission: Boolean,
  pagesAccessPermission: Boolean,
  pagesPermission: Boolean,
  pollsPermission: Boolean,
  subscriberPermission: Boolean,
  surveySermission: Boolean,
  apiPermission: Boolean,
  configure_message_alerts: Boolean
})

module.exports = mongoose.model('role_permissions', RolePermissionsSchema)

'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserPermissionsSchema = new Schema({
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  billingPermission: { type: Boolean, default: true },
  downgradeService: { type: Boolean, default: true },
  upgradeService: { type: Boolean, default: true },
  terminateService: { type: Boolean, default: true },
  customerMatchingPermission: { type: Boolean, default: true },
  dashboardPermission: { type: Boolean, default: true },
  companyPermission: { type: Boolean, default: true },
  companyUpdatePermission: { type: Boolean, default: true },
  membersPermission: { type: Boolean, default: true },
  inviteAdminPermission: { type: Boolean, default: true },
  deleteAdminPermission: { type: Boolean, default: true },
  updateRolePermission: { type: Boolean, default: true },
  inviteAgentPermission: { type: Boolean, default: true },
  deleteAgentPermission: { type: Boolean, default: true },
  invitationsPermission: { type: Boolean, default: true },
  broadcastPermission: { type: Boolean, default: true },
  autopostingPermission: { type: Boolean, default: true },
  livechatPermission: { type: Boolean, default: true },
  menuPermission: { type: Boolean, default: true },
  pagesAccessPermission: { type: Boolean, default: true },
  pagesPermission: { type: Boolean, default: true },
  pollsPermission: { type: Boolean, default: true },
  subscriberPermission: { type: Boolean, default: true },
  surveyPermission: { type: Boolean, default: true },
  apiPermission: { type: Boolean, default: true },
  muteNotifications: [String],
  slaDashboard: Boolean
})

module.exports = mongoose.model('permissions', UserPermissionsSchema)

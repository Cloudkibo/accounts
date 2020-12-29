var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PermissionsSchema = new Schema({
  plan_id: {type: Schema.ObjectId, ref: 'plans'},
  customer_matching: Boolean,
  invite_team: Boolean,
  dashboard: Boolean,
  broadcasts: Boolean,
  broadcasts_templates: Boolean,
  polls: Boolean,
  polls_reports: Boolean,
  surveys: Boolean,
  surveys_reports: Boolean,
  csv_exports: Boolean,
  livechat: Boolean,
  autoposting: Boolean,
  menu: Boolean,
  manage_pages: Boolean,
  manage_subscribers: Boolean,
  subscribe_to_messenger: Boolean,
  team_members_management: Boolean,
  messenger_links: Boolean,
  comment_capture: Boolean,
  messenger_code: Boolean,
  analytics: Boolean,
  api: Boolean,
  advanced_segmentation: Boolean,
  buy_button: Boolean,
  segmentation_lists: Boolean,
  user_permissions: Boolean,
  greeting_text: Boolean,
  welcome_message: Boolean,
  html_widget: Boolean,
  livechat_response_methods: Boolean,
  kibopush_widget: Boolean,
  webhook: Boolean,
  survey_templates: Boolean,
  poll_templates: Boolean,
  message_alerts: Boolean
})

module.exports = mongoose.model('permissions_plan', PermissionsSchema)

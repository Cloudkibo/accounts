var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PermissionsSchema = new Schema({
  plan_id: {type: Schema.ObjectId, ref: 'plans'},
  customer_matching: Boolean,
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
  buy_button: Boolean,
  segmentation_lists: Boolean,
  greeting_text: Boolean,
  welcome_message: Boolean,
  livechat_response_methods: Boolean,
  webhook: Boolean,
  survey_templates: Boolean,
  poll_templates: Boolean,
  message_alerts: Boolean,
  sla_dashboard: Boolean,
  custom_fields: Boolean,
  tags: Boolean,
  unsubscribe_subscribers: Boolean,
  user_input: Boolean,
  flow_builder: Boolean,
  sponsored_broadcast: Boolean,
  scheduled_sponsored_broadcast: Boolean,
  autoposting_history: Boolean,
  rss_integration: Boolean,
  news_integration: Boolean,
  sequence_messaging: Boolean,
  landing_pages: Boolean,
  json_ads: Boolean,
  customer_chat_plugin: Boolean,
  checkbox_plugin: Boolean,
  overlay_widgets: Boolean,
  invite_members: Boolean,
  google_sheets_integration: Boolean,
  dialogflow_integration: Boolean,
  hubspot_integration: Boolean,
  advanced_settings: Boolean,
  resolve_reopen_sessions: Boolean,
  search_chat: Boolean,
  hide_messages_after_days: Number,
  assign_sessions: Boolean,
  pending_chat_flag: Boolean,
  smart_replies: Boolean,
  chatbot_automation: Boolean,
  delete_account_information: Boolean,
  broadcast_levels: Number, // Number of levels allowed in broadcast (Flow Builder)
  intents_per_bot: Number, // Number of intents created per bot
  chatbot_automation_levels: Number // Number of chatbot automation levels
})

module.exports = mongoose.model('permissions_plan', PermissionsSchema)

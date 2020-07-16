var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PermissionsSchema = new Schema({
  plan_id: {type: Schema.ObjectId, ref: 'plans'},
  customer_matching: Boolean, // done
  dashboard: Boolean, // done
  broadcasts: Boolean, // done
  broadcasts_templates: Boolean,
  polls: Boolean, // done
  polls_reports: Boolean,
  surveys: Boolean, // done
  surveys_reports: Boolean,
  csv_exports: Boolean,
  livechat: Boolean, // done
  autoposting: Boolean, // done
  menu: Boolean,
  manage_pages: Boolean,
  manage_subscribers: Boolean, // done
  subscribe_to_messenger: Boolean, // done
  team_members_management: Boolean,
  messenger_links: Boolean, // done
  comment_capture: Boolean, // done
  messenger_code: Boolean, // done
  analytics: Boolean,
  buy_button: Boolean,
  segmentation_lists: Boolean,
  greeting_text: Boolean,
  welcome_message: Boolean,
  livechat_response_methods: Boolean,
  webhook: Boolean,
  survey_templates: Boolean,
  poll_templates: Boolean,
  custom_fields: Boolean, // done
  tags: Boolean, // done
  unsubscribe_subscribers: Boolean,
  user_input: Boolean,
  flow_builder: Boolean,
  sponsored_broadcast: Boolean, // done
  scheduled_sponsored_broadcast: Boolean,
  autoposting_history: Boolean,
  rss_integration: Boolean, // done
  news_integration: Boolean, // done
  sequence_messaging: Boolean, // done
  landing_pages: Boolean, // done
  json_ads: Boolean, // done
  customer_chat_plugin: Boolean, // done
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
  chatbot_automation: Boolean, // done
  delete_account_information: Boolean
})

module.exports = mongoose.model('permissions_plan', PermissionsSchema)

'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let CompanyUsageSchema = new Schema({
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'},
  broadcasts: Number, // number of broadcasts user can send
  surveys: Number, // number of surveys user can send
  polls: Number, // number of polls user can send
  broadcast_templates: Number, // number of broadcast templates user can create
  survey_templates: Number, // number of survey templates user can create
  polls_templates: Number, // number of poll templates user can create
  chat_messages: Number, // number of chat messages user can have
  facebook_pages: Number, // number of pages user can connect
  bots: Number, // number of bots user can create
  subscribers: Number, // number of subscribers user can have
  phone_invitation: Number, // number of people user can invite using phone numbers
  facebook_autoposting: Number, // number of facebook pages user can connect
  twitter_autoposting: Number, // number of twitter accounts user can connect
  wordpress_autoposting: Number, // number of wordpress blogs user can connect
  broadcast_sequences: Number, // number of sequences user can create
  messages_per_sequence: Number, // number of messages per sequence
  segmentation_lists: Number, // Number of segmentation lists
  custom_fields: Number, // Number of user created custom fields
  tags: Number, // Number of tags
  tags_per_subscriber: Number, // Number of tags can be assigne to a subscriber
  template_categories: Number, // Number of template categories
  rss_feeds: Number, // Number off rss feeds that can be added
  news_integration_feeds: Number, // Number of news integration feeds that can be added
  broadcast_levels: Number, // Number of levels allowed in broadcast (Flow Builder)
  comment_capture_rules: Number, // Number of comment capture rules
  messenger_codes: Number, // Number of messenger codes
  landing_pages: Number, // Number of landing pages
  json_ads: Number, // Number of json ads
  messenger_ref_urls: Number, // Number of messenger ref urls
  overlay_widgets: Number, // Number of overlay widgets
  members: Number, // Number of members in team account
  teams: Number, // Number of teams
  external_integrations: Number, // Number of external integrations
  intents_per_bot: Number, // Number of intents created per bot
  sponsored_broadcasts: Number, // Number of sponsored broadcasts ads
  chatbot_automation: Number, // Number of chatbot automation
  chatbot_automation_levels: Number // Number of chatbot automation levels
})

module.exports = mongoose.model('company_usage', CompanyUsageSchema)

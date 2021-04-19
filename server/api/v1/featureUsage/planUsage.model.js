/**
 * Created by imran on 11/07/2018.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let PlanUsageSchema = new Schema({
  planId: {type: Schema.ObjectId, ref: 'plans'},
  broadcasts: Number, // number of broadcasts user can send
  surveys: Number, // number of surveys user can send
  polls: Number, // number of polls user can send
  broadcast_templates: Number, // number of broadcast templates user can create
  survey_templates: Number, // number of survey templates user can create
  polls_templates: Number, // number of poll templates user can create
  sessions: Number, // number of sessions user can have
  chat_messages: Number, // number of chat messages user can have
  facebook_pages: Number, // number of pages user can connect
  bots: Number, // number of bots user can create
  subscribers: Number, // number of subscribers user can have
  labels: Number, // number of labels user can create
  phone_invitation: Number, // number of people user can invite using phone numbers
  facebook_autoposting: Number, // number of facebook pages user can connect
  twitter_autoposting: Number, // number of twitter accounts user can connect
  wordpress_autoposting: Number, // number of wordpress blogs user can connect
  broadcast_sequences: Number, // number of sequences user can create
  messages_per_sequence: Number, // number of messages per sequence
  segmentation_lists: Number,
  messages: Number
})

module.exports = mongoose.model('plan_usage', PlanUsageSchema)


'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let PlansSchema = new Schema({
  name: String,
  unique_ID: String,
  amount: Number,
  interval: String,
  platform: { type: String, enum: ['sms', 'whatsApp', 'messenger'] },
  trial_period: { type: Number, default: 30 },
  default: { type: Boolean, default: false }
})

module.exports = mongoose.model('plans', PlansSchema)

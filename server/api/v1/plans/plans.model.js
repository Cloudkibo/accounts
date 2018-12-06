
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let PlansSchema = new Schema({
  name: String,
  unique_ID: String,
  amount: Number,
  interval: String,
  trial_period: { type: Number, default: 30 },
  default_individual: { type: Boolean, default: false },
  default_team: { type: Boolean, default: false }
})

module.exports = mongoose.model('plans', PlansSchema)

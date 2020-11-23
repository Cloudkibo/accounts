'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let AddOns = new Schema({
  feature: String,
  description: String,
  price: String,
  currency: String,
  permissions: [String],
  others: Schema.Types.Mixed,
  datetime:  {type: Date, default: Date.now}
})

module.exports = mongoose.model('addOns', AddOns)

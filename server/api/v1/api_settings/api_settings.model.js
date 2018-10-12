'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ApiSettingsSchema = new Schema({
  company_id: String,
  app_id: String,
  app_secret: String,
  enabled: {type: Boolean, default: false}
})

module.exports = mongoose.model('api_settings', ApiSettingsSchema)

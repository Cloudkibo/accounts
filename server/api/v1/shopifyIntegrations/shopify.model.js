'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ShopifyIntegration = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'users'},
  companyId: {type: Schema.Types.ObjectId, ref: 'companyprofile'},
  shopUrl: String,
  shopToken: String,
  datetime: {type: Date, default: Date.now}
})

module.exports = mongoose.model('shopifyintegration', ShopifyIntegration)

'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ShopifyIntegration = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'users'},
  companyId: {type: Schema.Types.ObjectId, ref: 'companyprofile'},
  shopUrl: String,
  shopToken: String,
  datetime: {type: Date, default: Date.now},
  abandonedCart: {
    language: {type: String, default: 'english'},
    supportNumber: { type: String },
    enabled: {type: Boolean, default: true}
  },
  orderConfirmation: {
    language: {type: String, default: 'english'},
    supportNumber: { type: String },
    enabled: {type: Boolean, default: true}
  },
  orderShipment: {
    language: {type: String, default: 'english'},
    supportNumber: { type: String },
    enabled: {type: Boolean, default: true}
  },
  COD: {
    language: {type: String, default: 'english'},
    supportNumber: { type: String },
    enabled: {type: Boolean, default: true}
  }
})

module.exports = mongoose.model('shopifyintegration', ShopifyIntegration)

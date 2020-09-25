'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let BigCommerceIntegration = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  companyId: { type: Schema.Types.ObjectId, ref: 'companyprofile' },
  payload: Schema.Types.Mixed,
  shopToken: String,
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('bigcommerceintegration', BigCommerceIntegration)

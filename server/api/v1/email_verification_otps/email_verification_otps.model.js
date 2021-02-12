'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EmailVerificationSchema = new Schema({
  companyId: {type: Schema.ObjectId, required: true, ref: 'companyprofile'},
  otp: {type: String, required: true},
  platform: {type: String, required: true}, // whatsapp or messenger
  commercePlatform: {type: String, required: true}, // shopify, bigcommerce etc
  subscriberId: {type: String}, // in case of messenger
  phone: {type: String}, // in case of whatsapp
  emailAddress: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now, expires: '4h'}
})

module.exports = mongoose.model('emailverificationotps', EmailVerificationSchema)

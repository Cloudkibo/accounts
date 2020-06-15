'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var stripeCustomer = require('./stripecustomer')
var config = require('../../../config/environment/index')

var CompanyprofileSchema = new Schema({
  companyName: String,
  companyDetail: String,
  ownerId: { type: Schema.ObjectId, ref: 'users' },
  planId: { type: Schema.ObjectId, ref: 'plans' },
  automated_options: {
    type: String,
    enum: ['AUTOMATED_CHAT', 'HUMAN_CHAT', 'MIX_CHAT', 'DISABLE_CHAT'],
    default: 'MIX_CHAT'
  },
  twilio: Schema.Types.Mixed,
  twilioWhatsApp: Schema.Types.Mixed,
  saveAutomationMessages: { type: Boolean, default: false },
  showAgentName: { type: Boolean, default: false }
})

var stripeOptions = config.stripeOptions
CompanyprofileSchema.plugin(stripeCustomer, stripeOptions)

module.exports = mongoose.model('companyprofile', CompanyprofileSchema)

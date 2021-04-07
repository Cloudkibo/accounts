'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CompanyPreferencesSchema = new Schema({
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  defaultZoomConfiguration: { type: Schema.Types.Mixed }
})

module.exports = mongoose.model('companypreferences', CompanyPreferencesSchema)

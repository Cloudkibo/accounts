'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let CompanyAddOns = new Schema({
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
	addOnId: { type: Schema.ObjectId, ref: 'addOns' },
	permissions: [String],
	datetime: {type: Date, default: Date.now},

})

module.exports = mongoose.model('companyAddOns', CompanyAddOns)

'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let CompanyUserSchema = new Schema({

  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  domain_email: String,
  role: String,
  expoListToken: [String]
})

module.exports = mongoose.model('companyuser', CompanyUserSchema)

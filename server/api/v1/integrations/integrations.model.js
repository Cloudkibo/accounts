let mongoose = require('mongoose')
let Schema = mongoose.Schema

let integrations = new Schema({
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  integrationName: String,
  integrationToken: String,
  integrationPayload: Schema.Types.Mixed,
  enabled: Boolean
})

module.exports = mongoose.model('integrations', integrations)

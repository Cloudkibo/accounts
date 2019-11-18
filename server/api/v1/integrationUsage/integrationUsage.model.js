let mongoose = require('mongoose')
let Schema = mongoose.Schema

let integrationUsage = new Schema({
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  integrationId: { type: Schema.ObjectId, ref: 'integrations' },
  outgoingDataCallsCount: {type: Number, default: 0},
  incomingDataCallsCount: {type: Number, default: 0},
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('integrationUsage', integrationUsage)

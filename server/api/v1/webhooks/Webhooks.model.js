let mongoose = require('mongoose')
let Schema = mongoose.Schema

const webhookSchema = new Schema({
  webhook_url: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  isEnabled: { type: Boolean, default: false },
  error_message: {type: String, default: null},
  optIn: Schema.Types.Mixed,
  pageId: {type: String}
})

module.exports = mongoose.model('webhooks', webhookSchema)

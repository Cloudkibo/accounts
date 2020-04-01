let mongoose = require('mongoose')
let Schema = mongoose.Schema

const pageSchema = new Schema({
  pageId: { type: String },
  pageName: { type: String },
  pageUserName: { type: String },
  pagePic: { type: String },
  likes: { type: Number },
  accessToken: { type: String },
  connected: { type: Boolean, default: false },
  userId: { type: Schema.ObjectId, ref: 'users' },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  greetingText: { type: String, default: 'Hi {{user_full_name}}! Please tap on getting started to start the conversation.' },
  welcomeMessage: { type: Schema.Types.Mixed },
  isWelcomeMessageEnabled: { type: Boolean, default: true },
  gotPageSubscriptionPermission: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  whitelist_domains: [String],
  reachEstimationId: String,
  subscriberLimitForBatchAPI: { type: Number, default: 100 },
  connectedFacebook: { type: Boolean, default: false },
  tasks: [String]
})

module.exports = mongoose.model('pages', pageSchema)

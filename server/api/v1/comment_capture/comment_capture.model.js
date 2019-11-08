'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let facebookPostSchema = new Schema({
  pageId: {type: Schema.ObjectId, ref: 'pages'},
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'},
  userId: { type: Schema.ObjectId, ref: 'users' },
  datetime: {type: Date, default: Date.now},
  payload: Schema.Types.Mixed,
  reply: String,
  includedKeywords: [String],
  excludedKeywords: [String],
  post_id: String,
  count: {type: Number, default: 0},
  title: String,
  existingPostUrl: String,
  secondReply: Schema.Types.Mixed
})

module.exports = mongoose.model('facebook_posts', facebookPostSchema)

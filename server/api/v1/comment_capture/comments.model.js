'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let commentsSchema = new Schema({
  postId: {type: Schema.ObjectId, ref: 'facebook_posts'},
  commentFbId: String,
  senderName: String,
  senderFbId: String,
  commentPayload: Schema.Types.Mixed,
  parentId: {type: Schema.ObjectId, ref: 'comments'},
  postFbLink: String,
  childCommentCount: {type: Number, default: 0},
  subscriberId: {type: Schema.ObjectId, ref: 'subscribers'},
  replySentOnMessenger: Boolean
})

module.exports = mongoose.model('comments', commentsSchema)

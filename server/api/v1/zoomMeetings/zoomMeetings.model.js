'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ZoomMeetings = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'users'},
  companyId: {type: Schema.Types.ObjectId, ref: 'companyprofile'},
  subscriberId: {type: Schema.Types.ObjectId, ref: 'subscribers'},
  zoomUserId: {type: Schema.Types.ObjectId, ref: 'zoomusers'},
  topic: String,
  agenda: String,
  invitationMessage: String,
  meetingUrl: String,
  datetime: {type: Date, default: Date.now},
  platform: String
})

module.exports = mongoose.model('zoommeetings', ZoomMeetings)

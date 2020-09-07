'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ZoomUsers = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'users'},
  companyId: {type: Schema.Types.ObjectId, ref: 'companyprofile'},
  zoomId: String,
  firstName: String,
  lastName: String,
  zoomRole: String,
  personalMeetingUrl: String,
  profilePic: String,
  language: String,
  phoneCountry: String,
  phoneNumber: String,
  accessToken: String,
  refreshToken: String,
  connected: { type: Boolean, default: true },
  meetingsPerDay: Schema.Types.Mixed,
  datetime: {type: Date, default: Date.now}
})

module.exports = mongoose.model('zoomusers', ZoomUsers)

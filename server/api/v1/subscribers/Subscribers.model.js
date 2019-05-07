let mongoose = require('mongoose')
let Schema = mongoose.Schema

const subscriberSchema = new Schema({
  pageScopedId: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  fullName: {
    type: String
  },
  locale: {
    type: String
  },
  timezone: {
    type: String
  },
  email: {
    type: String
  },
  gender: {
    type: String
  },
  senderId: {
    type: String
  },
  profilePic: {
    type: String
  },
  coverPhoto: {
    type: String
  },
  pageId: {
    type: Schema.ObjectId,
    ref: 'pages'
  },
  phoneNumber: {
    type: String
  },
  unSubscribedBy: {type: String, default: 'subscriber'},
  source: {type: String, default: 'direct_message'},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  isSubscribed: {
    type: Boolean,
    default: true
  },
  isEnabledByPage: {
    type: Boolean,
    default: true
  },
  status: {
    type: String
  },
  last_activity_time: {
    type: Date
  },
  userRefIdForCheckBox: {
    type: String
  },
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('subscribers', subscriberSchema)

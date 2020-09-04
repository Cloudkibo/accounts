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
    type: String,
    default: 'new'
  },
  last_activity_time: {
    type: Date,
    default: Date.now
  },
  lastMessagedAt: {
    type: Date,
    default: Date.now
  },
  userRefIdForCheckBox: {
    type: String
  },
  datetime: { type: Date, default: Date.now },
  assigned_to: { type: Schema.Types.Mixed },
  is_assigned: {
    type: Boolean,
    default: false
  },
  pendingResponse: {
    type: Boolean,
    default: true
  },
  unreadCount: {type: Number, default: 0},
  messagesCount: {type: Number, default: 0},
  awaitingCommentReply: {type: Schema.Types.Mixed},
  waitingForUserInput: {type: Schema.Types.Mixed},
  completeInfo: {type: Boolean, default: true},
  siteInfo: { type: Schema.Types.Mixed },
  shopifyCustomer: { type: Schema.Types.Mixed },
  shoppingCart: { type: Array, default: [] },
  usingChatBot: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('subscribers', subscriberSchema)

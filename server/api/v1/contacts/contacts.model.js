let mongoose = require('mongoose')
let Schema = mongoose.Schema

let contacts = new Schema({
  name: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  number: {type: String},
  otherColumns: Schema.Types.Mixed,
  datetime: { type: Date, default: Date.now },
  last_activity_time: { type: Date, default: Date.now },
  lastMessagedAt: { type: Date, default: Date.now },
  hasChat: {type: Boolean, default: false},
  isSubscribed: {type: Boolean, default: true},
  unreadCount: {type: Number, default: 0},
  messagesCount: {type: Number, default: 0},
  chatbotContext: {type: String},
  lastMessageSentByBot: { type: Schema.Types.Mixed },
  commerceCustomerShopify: { type: Schema.Types.Mixed },
  shoppingCart: { type: Array, default: [] },
  chatbotPaused: { type: Boolean, default: false },
  marketing_optin: { type: Boolean, default: false },
  pendingResponse: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'new'
  },
  assigned_to: { type: Schema.Types.Mixed },
  is_assigned: {
    type: Boolean,
    default: false
  },
  listIds: [String],
  waitingForBroadcastResponse: {
    status: Boolean,
    broadcastId: String
  }
})

module.exports = mongoose.model('contacts', contacts)

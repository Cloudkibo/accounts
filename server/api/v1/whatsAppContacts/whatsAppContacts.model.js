let mongoose = require('mongoose')
let Schema = mongoose.Schema

let contacts = new Schema({
  name: { type: String },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  number: { type: String },
  whatsAppId: { type: String },
  datetime: { type: Date, default: Date.now },
  last_activity_time: { type: Date, default: Date.now },
  isSubscribed: { type: Boolean, default: true },
  status: { type: String, default: 'new' },
  unreadCount: { type: Number, default: 0 },
  messagesCount: { type: Number, default: 0 },
  pendingResponse: { type: Boolean, default: true },
  is_assigned: { type: Boolean, default: false },
  assigned_to: { type: Schema.Types.Mixed },
  unSubscribedBy: { type: String, default: 'subscriber' },
  lastMessagedAt: { type: Date },
  lastMessageSentByBot: { type: Schema.Types.Mixed },
  chatbotContext: {type: 'String'},
  commerceCustomer: { type: Schema.Types.Mixed }, // default one is for big commerce
  commerceCustomerShopify: { type: Schema.Types.Mixed },
  shoppingCart: { type: Array, default: [] },
  activeChatbotId: {type: String},
  activeChatbotBuilt: {type: String}
})

module.exports = mongoose.model('whatsAppContacts', contacts)

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let contacts = new Schema({
  name: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  number: {type: String},
  otherColumns: Schema.Types.Mixed,
  datetime: { type: Date, default: Date.now },
  last_activity_time: { type: Date },
  hasChat: {type: Boolean, default: false},
  isSubscribed: {type: Boolean, default: true},
  unreadCount: {type: Number, default: 0},
  messagesCount: {type: Number, default: 0},
  pendingResponse: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'new'
  },
  assigned_to: { type: Schema.Types.Mixed },
  is_assigned: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('contacts', contacts)

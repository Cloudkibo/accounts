let mongoose = require('mongoose')
let Schema = mongoose.Schema

let contacts = new Schema({
  name: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  number: {type: String},
  datetime: { type: Date, default: Date.now },
  last_activity_time: { type: Date },
  hasChat: {type: Boolean, default: false}
})

module.exports = mongoose.model('whatsAppContacts', contacts)

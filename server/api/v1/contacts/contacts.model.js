let mongoose = require('mongoose')
let Schema = mongoose.Schema

let contacts = new Schema({
  name: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  number: {type: String},
  otherColumns: Schema.Types.Mixed,
  datetime: { type: Date, default: Date.now },
  last_activity_time: { type: Date }
})

module.exports = mongoose.model('contacts', contacts)

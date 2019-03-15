let mongoose = require('mongoose')
let Schema = mongoose.Schema

let contacts = new Schema({
  name: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  number: {type: String},
  additionalColumns: Schema.Types.Mixed,
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('contacts', contacts)

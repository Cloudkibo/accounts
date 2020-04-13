let mongoose = require('mongoose')
let Schema = mongoose.Schema

let contactLists = new Schema({
  name: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('contactLists', contactLists)

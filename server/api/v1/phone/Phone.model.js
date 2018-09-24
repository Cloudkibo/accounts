let mongoose = require('mongoose')
let Schema = mongoose.Schema

let phoneNumberSchema = new Schema({
  name: String,
  number: String,
  userId: { type: Schema.ObjectId, ref: 'users' },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  datetime: { type: Date, default: Date.now },
  hasSubscribed: { type: Boolean, default: false },
  pageId: {
    type: Schema.ObjectId,
    ref: 'pages'
  },
  pageIdFb: String,
  fileName: [String]
})

module.exports = mongoose.model('phoneNumber', phoneNumberSchema)
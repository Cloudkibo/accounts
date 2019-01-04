let mongoose = require('mongoose')
let Schema = mongoose.Schema

let jsonAd = new Schema({
  pageId: {type: String, ref: 'pages'},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  messageContent: [{type: Object}]
})

module.exports = mongoose.model('jsonAd', jsonAd)

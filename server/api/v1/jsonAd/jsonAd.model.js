let mongoose = require('mongoose')
let Schema = mongoose.Schema

let jsonAd = new Schema({
  pageId: {type: String, ref: 'pages'},
  title: {type: String},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('jsonAd', jsonAd)

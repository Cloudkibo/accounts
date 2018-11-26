let mongoose = require('mongoose')
let Schema = mongoose.Schema

let codeAnalytics = new Schema({
  userId: {type: Schema.ObjectId, ref: 'users'},
  pageId: {type: String, ref: 'pages'},
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  ref: String,
  opened: {type: Number, default: 0},
  subscribers: {type: Number, default: 0}
})

module.exports = mongoose.model('codeAnalytics', codeAnalytics)

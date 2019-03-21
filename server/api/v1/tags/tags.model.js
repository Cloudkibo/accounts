let mongoose = require('mongoose')
let Schema = mongoose.Schema

const tagSchema = new Schema({
  tag: {type: String},
  userId: {type: Schema.ObjectId, ref: 'users'},
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'},
  dateCreated: {type: Date, default: Date.now},
  pageId: String,
  labelFbId: String,
  defaultTag: {type: Boolean, default: false}
})

module.exports = mongoose.model('tags', tagSchema)

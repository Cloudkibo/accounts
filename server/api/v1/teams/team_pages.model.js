let mongoose = require('mongoose')
let Schema = mongoose.Schema

let teamPagesSchema = new Schema({
  teamId: {type: Schema.ObjectId, ref: 'teams'},
  pageId: {type: Schema.ObjectId, ref: 'pages'},
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'}
})

module.exports = mongoose.model('teamPages', teamPagesSchema)

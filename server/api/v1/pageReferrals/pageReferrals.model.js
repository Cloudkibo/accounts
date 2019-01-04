let mongoose = require('mongoose')
let Schema = mongoose.Schema

const pageReferralsSchema = new Schema({
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  pageId: { type: Schema.ObjectId, ref: 'pages' },
  ref_parameter: {type: String},
  reply: {type: Schema.Types.Mixed},
  sequenceId: {type: String}
})

module.exports = mongoose.model('pageReferrals', pageReferralsSchema)

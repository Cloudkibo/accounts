let mongoose = require('mongoose')
let Schema = mongoose.Schema

const landingPageSchema = new Schema({
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  pageId: { type: Schema.ObjectId, ref: 'pages' },
  initialState: { type: Schema.ObjectId, ref: 'landingPageStates' },
  submittedState: {type: Schema.Types.Mixed},
  optInMessage: {type: Schema.Types.Mixed},
  title: {type: String},
  isActive: {type: Boolean, default: true}

})

module.exports = mongoose.model('landingPages', landingPageSchema)

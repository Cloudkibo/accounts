let mongoose = require('mongoose')
let Schema = mongoose.Schema

const overlayWidgetsSchema = new Schema({
  widgetType: String,
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  userId: { type: Schema.ObjectId, ref: 'users' },
  pageId: { type: Schema.ObjectId, ref: 'pages' },
  isActive: {type: Boolean, default: false},
  initialState: {type: Schema.Types.Mixed},
  submittedState: {type: Schema.Types.Mixed},
  optInMessage: {type: Schema.Types.Mixed},
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('overlayWidgets', overlayWidgetsSchema)

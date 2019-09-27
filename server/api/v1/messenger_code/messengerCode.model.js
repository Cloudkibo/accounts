let mongoose = require('mongoose')
let Schema = mongoose.Schema

const messengerCodeSchema = new Schema({
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  pageId: { type: Schema.ObjectId, ref: 'pages' },
  QRCode: {type: String},
  optInMessage: {type: Schema.Types.Mixed}
})

module.exports = mongoose.model('messengerCodes', messengerCodeSchema)

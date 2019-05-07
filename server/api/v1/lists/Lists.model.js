let mongoose = require('mongoose')
let Schema = mongoose.Schema

const listSchema = new Schema({
  listName: {
    type: String
  },
  userId: { type: Schema.ObjectId, ref: 'users' },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  datetime: { type: Date, default: Date.now },
  content: {type: Schema.Types.Mixed},
  conditions: {type: Schema.Types.Mixed},
  initialList: { type: Boolean, default: false },
  parentList: { type: Schema.ObjectId },
  joiningCondition: {type: String},
  parentListName: { type: String }
})

module.exports = mongoose.model('lists', listSchema)
let mongoose = require('mongoose')
let Schema = mongoose.Schema

const customFieldsSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  isDefault: { type: Boolean },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  createdBy: { type: Schema.ObjectId, ref: 'users' },
  createdDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('custom_fields', customFieldsSchema)

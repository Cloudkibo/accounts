let mongoose = require('mongoose')
let Schema = mongoose.Schema

let contacts = new Schema({
  componentName: { type: String },
  componentRepositoryUrl: { type: String },
  componentAuthor: { type: String },
  isPublic: { type: Boolean, default: true },
  status: { type: String, default: 'published' },
  category: { type: String },
  description: { type: String },
  preferences: {
    height: { type: String, default: 'full' },
    sharingEnabled: { type: Boolean, default: false }
  },
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  componentRepositoryLocalPath: { type: String },
  datetime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('whatsAppContacts', contacts)

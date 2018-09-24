let mongoose = require('mongoose')
let Schema = mongoose.Schema

let teamSchema = new Schema({
  name: String,
  description: String,
  created_by: { type: Schema.ObjectId, ref: 'users' },
  // There should be CRUD for Company profle as well
  companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
  teamPages: [String],
  teamPagesIds: [String],
  creation_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('teams', teamSchema)

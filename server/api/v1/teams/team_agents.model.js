let mongoose = require('mongoose')
let Schema = mongoose.Schema

let teamAgentsSchema = new Schema({
  teamId: {type: Schema.ObjectId, ref: 'teams'},
  companyId: {type: Schema.ObjectId, ref: 'companyprofile'},
  agentId: {type: Schema.ObjectId, ref: 'users'},
  join_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('teamAgents', teamAgentsSchema)

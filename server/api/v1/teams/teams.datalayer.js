/*
This file will contain the functions for Data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const TeamModel = require('./teams.model')
const TeamAgentsModel = require('./team_agents.model')
const TeamPagesModel = require('./team_pages.model')
const ObjectId = require('mongoose').Types.ObjectId

exports.saveTeamDocument = (name, description, createdBy, companyId, teamPages, teamPagesIds) => {
  // createdBy = ObjectId.isValid(createdBy) ? createdBy : new ObjectId(createdBy)
  // companyId = ObjectId.isValid(companyId) ? companyId : new ObjectId(companyId)
  let payload = new TeamModel({
    name, description, created_by: createdBy, companyId, teamPages, teamPagesIds
  })
  return payload.save(payload)
}

exports.findOneTeamObject = (teamId) => {
  return TeamModel.findOne({_id: teamId})
    .exec()
}

exports.findAllTeamObjects = () => {
  return TeamModel.find()
    .exec()
}

exports.updateTeamObject = (userId, payload) => {
  return TeamModel.updateOne({_id: userId}, payload)
    .exec()
}

exports.deleteTeamObject = (teamId) => {
  return TeamModel.deleteOne({_id: teamId})
    .exec()
}

// Agent DB Handlers
exports.findAllAgentObjects = () => {
  return TeamAgentsModel.find()
    .exec()
}

exports.saveAgentDocument = (teamId, companyId, agentId) => {
  let payload = { teamId, companyId, agentId }
  return TeamAgentsModel.create(payload)
}

exports.deleteAgentObject = (teamId, companyId, agentId) => {
  let payload = { teamId, companyId, agentId }
  return TeamAgentsModel.deleteOne(payload)
    .exec()
}

// Team Pages DB Handlers
exports.findAllTeamPageObjects = () => {
  return TeamPagesModel.find()
    .exec()
}

exports.saveTeamPageDocument = (teamId, companyId, pageId) => {
  let payload = { teamId, companyId, pageId }
  return TeamPagesModel.create(payload)
}

exports.deleteAgentObject = (teamId, companyId, pageId) => {
  let payload = { teamId, companyId, pageId }
  return TeamPagesModel.deleteOne(payload)
    .exec()
}

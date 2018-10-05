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

exports.findOneTeamObjectUsingQuery = (queryObject) => {
  return TeamModel.findOne(queryObject)
    .exec()
}

exports.findAllTeamObjectsUsingQuery = (queryObject) => {
  return TeamModel.find(queryObject)
    .exec()
}

exports.findTeamObjectUsingAggregate = (aggregateObject) => {
  return TeamModel.aggregate(aggregateObject)
    .then()
}

exports.updateTeamObject = (userId, payload) => {
  return TeamModel.updateOne({_id: userId}, payload)
    .exec()
}

exports.genericUpdateTeamObject = (query, updated, options) => {
  return TeamModel.update(query, updated, options)
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

exports.findOneAgentObjectUsingQuery = (queryObject) => {
  return TeamAgentsModel.findOne(queryObject)
    .exec()
}

exports.findAllAgentObjectsUsingQuery = (queryObject) => {
  return TeamAgentsModel.find(queryObject)
    .exec()
}

exports.findDistinctAgentObjectsUsingQuery = (queryObject) => {
  return TeamAgentsModel.find(queryObject)
    .distinct('agentId')
    .exec()
}

exports.findAgentObjectUsingAggregate = (aggregateObject) => {
  return TeamAgentsModel.aggregate(aggregateObject)
    .then()
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

exports.genericUpdateAgentObject = (query, updated, options) => {
  return TeamAgentsModel.update(query, updated, options)
    .exec()
}

// Team Pages DB Handlers
exports.findAllTeamPageObjects = () => {
  return TeamPagesModel.find()
    .exec()
}

exports.findOneTeamPageObjectUsingQuery = (queryObject) => {
  return TeamPagesModel.findOne(queryObject)
    .exec()
}

exports.findAllTeamPageObjectsUsingQuery = (queryObject) => {
  return TeamPagesModel.find(queryObject)
    .exec()
}

exports.findDistinctPageObjectsUsingQuery = (queryObject) => {
  return TeamPagesModel.find(queryObject)
    .distinct('pageId')
    .exec()
}

exports.findTeamPageObjectUsingAggregate = (aggregateObject) => {
  return TeamPagesModel.aggregate(aggregateObject)
    .then()
}

exports.saveTeamPageDocument = (teamId, companyId, pageId) => {
  let payload = { teamId, companyId, pageId }
  return TeamPagesModel.create(payload)
}

exports.genericUpdatePageObject = (query, updated, options) => {
  return TeamPagesModel.update(query, updated, options)
    .exec()
}

exports.deleteAgentObject = (teamId, companyId, pageId) => {
  let payload = { teamId, companyId, pageId }
  return TeamPagesModel.deleteOne(payload)
    .exec()
}

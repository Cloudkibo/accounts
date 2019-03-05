const { callApi } = require('../../scripts/apiCaller')

exports.aggregateForBroadcasts = (match, group, lookup, limit, sort, skip) => {
  let query = {
    purpose: 'aggregate',
    match: match.$match
  }
  if (group) query.group = group.$group
  if (lookup) query.lookup = lookup.$lookup
  if (limit) query.limit = limit.$limit
  if (sort) query.sort = sort.$sort
  if (skip) query.skip = skip.$skip
  return callApi(`broadcasts/kiboDashQuery`, 'post', query, '', 'kiboengage')
}
exports.aggregateForPolls = (match, group, lookup, limit, sort, skip) => {
  let query = {
    purpose: 'aggregate',
    match: match.$match
  }
  if (group) query.group = group.$group
  if (lookup) query.lookup = lookup.$lookup
  if (limit) query.limit = limit.$limit
  if (sort) query.sort = sort.$sort
  if (skip) query.skip = skip.$skip
  return callApi(`polls/kiboDashQuery`, 'post', query, '', 'kiboengage')
}
exports.aggregateForSurveys = (match, group, lookup, limit, sort, skip) => {
  let query = {
    purpose: 'aggregate',
    match: match.$match
  }
  if (group) query.group = group.$group
  if (lookup) query.lookup = lookup.$lookup
  if (limit) query.limit = limit.$limit
  if (sort) query.sort = sort.$sort
  if (skip) query.skip = skip.$skip
  return callApi(`surveys/kiboDashQuery`, 'post', query, '', 'kiboengage')
}
exports.aggregateForBroadcastPages = (match, group, lookup, limit, sort, skip) => {
  let query = {
    purpose: 'aggregate',
    match: match.$match
  }
  if (group) query.group = group.$group
  if (lookup) query.lookup = lookup.$lookup
  if (limit) query.limit = limit.$limit
  if (sort) query.sort = sort.$sort
  if (skip) query.skip = skip.$skip
  return callApi(`page_broadcast/query`, 'post', query, '', 'kiboengage')
}
exports.aggregateForSurveyPages = (match, group, lookup, limit, sort, skip) => {
  let query = {
    purpose: 'aggregate',
    match: match.$match
  }
  if (group) query.group = group.$group
  if (lookup) query.lookup = lookup.$lookup
  if (limit) query.limit = limit.$limit
  if (sort) query.sort = sort.$sort
  if (skip) query.skip = skip.$skip
  return callApi(`page_survey/query`, 'post', query, '', 'kiboengage')
}
exports.aggregateForPollPages = (match, group, lookup, limit, sort, skip) => {
  let query = {
    purpose: 'aggregate',
    match: match.$match
  }
  if (group) query.group = group.$group
  if (lookup) query.lookup = lookup.$lookup
  if (limit) query.limit = limit.$limit
  if (sort) query.sort = sort.$sort
  if (skip) query.skip = skip.$skip
  return callApi(`page_poll/query`, 'post', query, '', 'kiboengage')
}
exports.aggregateForAutoposting = (lookup, project, projectAgain, match) => {
  let query = {
    purpose: 'aggregate'
  }
  if (lookup) query.lookup = lookup.$lookup
  if (project) query.project = project.$project
  if (projectAgain) query.projectAgain = projectAgain.$project
  if (match) query.match = match.$match
  return callApi(`autoposting/kiboDashQuery`, 'post', query, '', 'kiboengage')
}

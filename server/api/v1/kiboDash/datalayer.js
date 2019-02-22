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
  return callApi(`broadcasts/query`, 'post', query, '', 'kiboengage')
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
  return callApi(`polls/query`, 'post', query, '', 'kiboengage')
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
  return callApi(`surveys/query`, 'post', query, '', 'kiboengage')
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
exports.aggregateForAutoposting = (match, group, lookup, project, limit, sort, skip) => {
  let query = {
    purpose: 'aggregate',
    match: match.$match
  }
  if (group) query.group = group.$group
  if (lookup) query.lookup = lookup.$lookup
  if (limit) query.limit = limit.$limit
  if (sort) query.sort = sort.$sort
  if (skip) query.skip = skip.$skip
  if (project) query.project = project.$project
  return callApi(`autoposting/query`, 'post', query, '', 'kiboengage')
}

const logger = require('../../../components/logger')
const TAG = 'api/kibodash/dash.controller.js'
const UsersDataLayer = require('../user/user.datalayer')
const PagesDataLayer = require('../pages/pages.datalayer')
const dataLayer = require('./datalayer')
const logicLayer = require('./logicLayer')
const SubscribersDataLayer = require('../subscribers/subscribers.datalayer')

// const Autoposting = require('../autoposting/autopostings.model')
// const PageBroadcasts = require('../page_broadcast/page_broadcast.model')
// const PagePolls = require('../page_poll/page_poll.model')
// const PageSurveys = require('../page_survey/page_survey.model')
const { filterConnectedPages, countResults, joinCompanyWithSubscribers, selectCompanyFields, filterDate,
  groupCompanyWiseAggregates, companyWisePageCount, joinPageWithSubscribers, selectPageFields,
  filterCompanySubscribers, filterUserDate, pageWiseAggregate, filterPageSubscribers,
  joinAutpostingMessages, dateFilterAutoposting, selectAutoPostingFields,
  selectTwitterType, selectFacebookType, selectWordpressType } = require('./pipeline')
// const { setBroadcastsCount, setPollsCount, setSurveysCount, setTotalPagesCount, setConnectedPagesCount } = require('./utility')
// const CompanyUsers = require('../companyuser/companyuser.model')
// const mongoose = require('mongoose')

exports.platformWiseData = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let startDate = req.body.startDate
  let dateFilterAggregates = filterDate
  dateFilterAggregates['$match']['datetime'] = { $gte: new Date(startDate) }

  let userDateFilter = filterUserDate
  userDateFilter['$match']['createdAt'] = { $gte: new Date(startDate) }
  let connectetPages = PagesDataLayer.aggregateInfo([filterConnectedPages, countResults])
  let totalPages = PagesDataLayer.aggregateInfo([countResults])
  let totalUsers = UsersDataLayer.aggregateInfo([userDateFilter, countResults])
  let totalSubscribers = SubscribersDataLayer.aggregateInfo([dateFilterAggregates, countResults])
  let totalBroadcasts = dataLayer.aggregateForBroadcasts(dateFilterAggregates, countResults)
  let totalPolls = dataLayer.aggregateForPolls(dateFilterAggregates, countResults).exec()
  let totalSurveys = dataLayer.aggregateForSurveys(dateFilterAggregates, countResults).exec()

  let finalResults = Promise.all([connectetPages, totalPages, totalUsers, totalSubscribers, totalBroadcasts, totalPolls, totalSurveys])
  // logger.serverLog(TAG, `user not found for page ${JSON.stringify(finalResults)}`)
  finalResults.then(function (results) {
    let data = {
      connectedPages: (results[0].length === 0) ? 0 : results[0][0].count,
      totalPages: (results[1].length === 0) ? 0 : results[1][0].count,
      totalUsers: (results[2].length === 0) ? 0 : results[2][0].count,
      totalSubscribers: (results[3].length === 0) ? 0 : results[3][0].count,
      totalBroadcasts: (results[4].length === 0) ? 0 : results[4][0].count,
      totalPolls: (results[5].length === 0) ? 0 : results[5][0].count,
      totalSurveys: (results[6].length === 0) ? 0 : results[6][0].count
    }
    res.status(200).json({
      status: 'success',
      payload: data
    })
  }).catch((err) => {
    res.status(500).json({
      status: 'failed',
      error: err
    })
  })
}
exports.pageWiseData = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let startDate = req.body.startDate
  let dateFilterSubscribers = filterPageSubscribers
  // add the date filter(as from reqeust) in the aggregate pipeline query for subscribers page wise
  dateFilterSubscribers['$project']['pageSubscribers']['$filter']['cond'] = {$gte: ['$$pageSubscriber.datetime', new Date(startDate)]}
  let dateFilterAggregates = filterDate
  // add date filter for broadcasts, polls, surveys count-page wise
  dateFilterAggregates['$match']['datetime'] = { $gte: new Date(startDate) }
  let data = PagesDataLayer.aggregateInfo([ joinPageWithSubscribers, dateFilterSubscribers, selectPageFields ])
  let numberOfBroadcast = dataLayer.aggregateForBroadcastPages(dateFilterAggregates, pageWiseAggregate)
  let numberOfPoll = dataLayer.aggregateForPollPages(dateFilterAggregates, pageWiseAggregate)
  let numberOfSurvey = dataLayer.aggregateForSurveyPages(dateFilterAggregates, pageWiseAggregate)
  let finalResults = Promise.all([ data, numberOfBroadcast, numberOfPoll, numberOfSurvey ])

  finalResults.then((results) => {
    data = results[0]
    let broadcastAggregates = results[1]
    let pollsAggregate = results[2]
    let surveysAggregate = results[3]
    // set Broadcasts count
    data = logicLayer.mapData(data, broadcastAggregates, pollsAggregate, surveysAggregate)

    res.status(200).json({
      status: 'success',
      payload: data
    })
  }).catch((err) => {
    return res.status(500).json({
      status: 'failed',
      error: err
    })
  })
}

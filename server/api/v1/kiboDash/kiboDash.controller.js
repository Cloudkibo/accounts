const logger = require('../../../components/logger')
const TAG = 'api/kibodash/dash.controller.js'
const UsersDataLayer = require('../user/user.datalayer')
const PagesDataLayer = require('../pages/pages.datalayer')
const dataLayer = require('./datalayer')
const logicLayer = require('./logiclayer')
const SubscribersDataLayer = require('../subscribers/subscribers.datalayer')
const { filterConnectedPages, countResults, joinCompanyWithSubscribers, selectCompanyFields,
  groupCompanyWiseAggregates, companyWisePageCount, joinPageWithSubscribers, selectPageFields,
  filterCompanySubscribers, filterUserDate, pageWiseAggregate, groupByPageId,
  joinAutpostingMessages, selectAutoPostingFields,
  selectTwitterType, selectFacebookType, selectWordpressType, dateFilterAutoposting, projectArrayElemAsPage } = require('./pipeline')
const CompanyUsersDataLayer = require('../companyuser/companyuser.datalayer')
const mongoose = require('mongoose')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.platformWiseData = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let startDate = ''
  let dateFilterAggregates = {$match: {}}
  if (req.body.startDate && req.body.startDate !== '') {
    startDate = req.body.startDate
    dateFilterAggregates['$match']['datetime'] = { $gte: new Date(startDate) }
  }
  let userDateFilter = filterUserDate
  userDateFilter['$match']['createdAt'] = { $gte: new Date(startDate) }
  let connectetPages = PagesDataLayer.aggregateInfo([filterConnectedPages, countResults])
  let totalPages = PagesDataLayer.aggregateInfo([countResults])
  let totalUsers = UsersDataLayer.aggregateInfo([userDateFilter, countResults])
  let totalSubscribers = SubscribersDataLayer.aggregateInfo([dateFilterAggregates, countResults])
  let totalBroadcasts = dataLayer.aggregateForBroadcasts(dateFilterAggregates, countResults)
  let totalPolls = dataLayer.aggregateForPolls(dateFilterAggregates, countResults)
  let totalSurveys = dataLayer.aggregateForSurveys(dateFilterAggregates, countResults)

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
    sendSuccessResponse(res, 200, data)
  }).catch((err) => {
    const message = err || 'Failed to Find  platformWiseData'
    logger.serverLog(message, `${TAG}: exports.platformWiseData`, req.body, {}, 'error')
    sendErrorResponse(res, 500, '', '', err)
  })
}
exports.pageWiseData = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let startDate = req.body.startDate
  let matchNewSubscribers = {$match: {}}
  if (req.body.startDate && req.body.startDate !== '') {
    matchNewSubscribers['$match']['datetime'] = { '$gte': new Date(startDate) }
  }
  // add the date filter(as from reqeust) in the aggregate pipeline query for subscribers page wise
  let dateFilterAggregates = {$match: {}}
  // add date filter for broadcasts, polls, surveys count-page wise
  if (req.body.startDate && req.body.startDate !== '') {
    dateFilterAggregates['$match']['datetime'] = { '$gte': new Date(startDate) }
  }
  let data = SubscribersDataLayer.aggregateInfo([ matchNewSubscribers, groupByPageId, joinPageWithSubscribers, projectArrayElemAsPage, selectPageFields ])
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
    sendSuccessResponse(res, 200, data)
  }).catch((err) => {
    const message = err || 'Failed to Find  pageWiseData'
    logger.serverLog(message, `${TAG}: exports.pageWiseData`, req.body, {}, 'error')
    sendErrorResponse(res, 500, '', '', err)
  })
}
exports.companyWiseData = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let startDate = req.body.startDate
  let dateFilterSubscribers = filterCompanySubscribers
  dateFilterSubscribers['$project']['companysubscribers']['$filter']['cond'] = {$gte: ['$$companysubscriber.datetime', new Date(startDate)]}
  let dateFilterAggregates = {$match: {}}
  if (req.body.startDate && req.body.startDate !== '') {
    dateFilterAggregates['$match']['datetime'] = { $gte: new Date(startDate) }
  }

  let companySubscribers = CompanyUsersDataLayer.aggregateInfo([joinCompanyWithSubscribers, dateFilterSubscribers, selectCompanyFields])
  let numberOfBroadcasts = dataLayer.aggregateForBroadcasts(dateFilterAggregates, groupCompanyWiseAggregates)
  let numberOfPolls = dataLayer.aggregateForPolls(dateFilterAggregates, groupCompanyWiseAggregates)
  let numberOfSurveys = dataLayer.aggregateForSurveys(dateFilterAggregates, groupCompanyWiseAggregates)
  let companyPagesCount = PagesDataLayer.aggregateInfo([companyWisePageCount])
  let companyConnectedPagesCount = PagesDataLayer.aggregateInfo([filterConnectedPages, companyWisePageCount])
  let finalResults = Promise.all([companySubscribers, numberOfBroadcasts, numberOfPolls, numberOfSurveys,
    companyPagesCount, companyConnectedPagesCount])

  finalResults.then(function (results) {
    let data = {}
    data = results[0]
    for (let i = 0; i < data.length; i++) {
      let userId = mongoose.Types.ObjectId(data[i].userId)
      UsersDataLayer.findOneUserObjectUsingQuery({_id: userId})
        .then(user => {
          if (user != null) {
            data[i].userName = user.name
          }
          if (i === (data.length - 1)) {
            logicLayer.setBroadcastsCount(results, data)
            logicLayer.setPollsCount(results, data)
            logicLayer.setSurveysCount(results, data)
            logicLayer.setTotalPagesCount(results, data)
            logicLayer.setConnectedPagesCount(results, data)

            sendSuccessResponse(res, 200, data)
          }
        })
        .catch((err) => {
          const message = err || 'Failed to Find User'
          logger.serverLog(message, `${TAG}: exports.companyWiseData`, req.body, {}, 'error')
          sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
        })
    }
  }).catch((err) => {
    const message = err || 'Failed to Find companyWiseData'
    logger.serverLog(message, `${TAG}: exports.companyWiseData`, req.body, {}, 'error')
    sendErrorResponse(res, 500, '', '', err)
  })
}
exports.getFacebookAutoposting = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash Facebook Autoposting ${JSON.stringify(req.body)}`)
  // let queries = logicLayer.getQuery(req.body)
  if (req.body.startDate && req.body.startDate !== '') {
    dataLayer.aggregateForAutoposting(
      joinAutpostingMessages,
      dateFilterAutoposting(req.body.startDate),
      selectAutoPostingFields,
      selectFacebookType)
      .then((result) => {
        sendSuccessResponse(res, 200, result)
      })
      .catch((err) => {
        const message = err || 'Failed to Find aggregate Autoposting Data'
        logger.serverLog(message, `${TAG}: exports.getFacebookAutoposting`, req.body, {}, 'error')
        sendErrorResponse(res, 500, '', err)
      })
  } else {
    dataLayer.aggregateForAutoposting(
      joinAutpostingMessages,
      null,
      selectAutoPostingFields,
      selectFacebookType)
      .then((result) => {
        sendSuccessResponse(res, 200, result)
      })
      .catch((err) => {
        const message = err || 'Failed to Find aggregate Autoposting Data'
        logger.serverLog(message, `${TAG}: exports.getFacebookAutoposting`, req.body, {}, 'error')
        sendErrorResponse(res, 500, '', err)
      })
  }
}
exports.getTwitterAutoposting = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash Twitter ${JSON.stringify(req.body)}`)
  if (req.body.startDate && req.body.startDate !== '') {
    dataLayer.aggregateForAutoposting(
      joinAutpostingMessages,
      dateFilterAutoposting(req.body.startDate),
      selectAutoPostingFields,
      selectTwitterType)
      .then((result) => {
        sendSuccessResponse(res, 200, result)
      })
      .catch((err) => {
        const message = err || 'Failed to Find aggregate Autoposting Data'
        logger.serverLog(message, `${TAG}: exports.getTwitterAutoposting`, req.body, {}, 'error')
        sendErrorResponse(res, 500, '', err)
      })
  } else {
    dataLayer.aggregateForAutoposting(
      joinAutpostingMessages,
      null,
      selectAutoPostingFields,
      selectTwitterType)
      .then((result) => {
        sendSuccessResponse(res, 200, result)
      })
      .catch((err) => {
        const message = err || 'Failed to Find aggregate Autoposting Data'
        logger.serverLog(message, `${TAG}: exports.getTwitterAutoposting`, req.body, {}, 'error')
        sendErrorResponse(res, 500, '', err)
      })
  }
}
exports.getWordpressAutoposting = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  if (req.body.startDate && req.body.startDate !== '') {
    dataLayer.aggregateForAutoposting(
      joinAutpostingMessages,
      dateFilterAutoposting(req.body.startDate),
      selectAutoPostingFields,
      selectWordpressType)
      .then((result) => {
        sendSuccessResponse(res, 200, result)
      })
      .catch((err) => {
        const message = err || 'Failed to Find aggregate Autoposting Data'
        logger.serverLog(message, `${TAG}: exports.getWordpressAutoposting`, req.body, {}, 'error')
        sendErrorResponse(res, 500, '', err)
      })
  } else {
    dataLayer.aggregateForAutoposting(
      joinAutpostingMessages,
      null,
      selectAutoPostingFields,
      selectWordpressType)
      .then((result) => {
        sendSuccessResponse(res, 200, result)
      })
      .catch((err) => {
        const message = err || 'Failed to Find aggregate Autoposting Data'
        logger.serverLog(message, `${TAG}: exports.getWordpressAutoposting`, req.body, {}, 'error')
        sendErrorResponse(res, 500, '', err)
      })
  }
}

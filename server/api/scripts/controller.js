const logger = require('../../components/logger')
const TAG = '/api/scripts/controller.js'
const SusbscribersDataLayer = require('../v1/subscribers/subscribers.datalayer')
const SubscribersModel = require('../v1/subscribers/Subscribers.model')
const { callApi } = require('./apiCaller')

exports.normalizeSubscribersDatetime = function (req, res) {
  logger.serverLog(TAG, 'Hit the scripts normalizeDatetime')
  SusbscribersDataLayer.findSubscriberObjects({})
    .then(subscribers => {
      if (subscribers.length > 0) {
        subscribers.forEach((sub, index) => {
          callApi(`sessions/query`, 'post', {purpose: 'findOne', match: {subscriber_id: sub._id.toString()}}, '', 'kibochat')
            .then(session => {
              if (session) {
                SusbscribersDataLayer.updateSubscriberObject(sub._id, {datetime: session.request_time})
                  .then(updated => {
                    if (index === (subscribers.length - 1)) {
                      return res.status(200).json({ status: 'success', payload: 'Normalized successfully!' })
                    }
                  })
                  .catch(err => {
                    return res.status(500).json({status: 'failed', payload: `Failed to update subscriber ${err}`})
                  })
              }
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to fetch sessions ${err}`})
            })
        })
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${err}`})
    })
}

function randomDate (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

exports.normalizeSubscribersDatetimeNull = function (req, res) {
  logger.serverLog(TAG, 'Hit the scripts normalizeDatetime')
  SubscribersModel.aggregate([
    {$match: {datetime: null}},
    {$group: {_id: '$pageId', count: {$sum: 1}}}
  ]).exec()
    .then(distintPages => {
      if (distintPages.length > 0) {
        distintPages.forEach(page => {
          SubscribersModel.find({pageId: page._id, datetime: null}).exec()
            .then(subscribers => {
              if (subscribers.length > 0) {
                let count = 0
                SubscribersModel.findOne({_id: {$lt: subscribers[0]._id}}).sort({_id: -1}).exec()
                  .then(startSub => {
                    if (startSub) {
                      const startDate = startSub.datetime
                      SubscribersModel.findOne({_id: {$gt: subscribers[subscribers.length - 1]._id}}).sort({_id: 1}).exec()
                        .then(endSub => {
                          if (endSub) {
                            const endDate = endSub.datetime
                            subscribers.forEach((sub, index) => {
                              let rDate = randomDate(new Date(startDate, endDate))
                              SubscribersModel.update({_id: sub._id}, {datetime: new Date(rDate)}).exec()
                                .then(updated => {
                                  count++
                                  if (index === (subscribers.length - 1)) {
                                    return res.status(200).json({ status: 'success', payload: `${count} records have been normalized successfully!` })
                                  }
                                })
                                .catch(err => {
                                  return res.status(500).json({status: 'failed', payload: `Failed to update subscriber ${err}`})
                                })
                            })
                          }
                        })
                        .catch(err => {
                          return res.status(500).json({status: 'failed', payload: `Failed to fetch end subscriber ${err}`})
                        })
                    }
                  })
                  .catch(err => {
                    return res.status(500).json({status: 'failed', payload: `Failed to fetch start subscriber ${err}`})
                  })
              }
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${err}`})
            })
        })
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch distint pages ${err}`})
    })
}

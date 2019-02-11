const logger = require('../../components/logger')
const TAG = '/api/scripts/controller.js'
const SubscribersDataLayer = require('../v1/subscribers/subscribers.datalayer')
const SubscribersModel = require('../v1/subscribers/Subscribers.model')
const { callApi } = require('./apiCaller')

exports.normalizeSubscribersDatetime = function (req, res) {
  logger.serverLog(TAG, 'Hit the scripts normalizeDatetime')
  SubscribersDataLayer.findSubscriberObjects({})
    .then(subscribers => {
      if (subscribers.length > 0) {
        subscribers.forEach((sub, index) => {
          callApi(`sessions/query`, 'post', {purpose: 'findOne', match: {subscriber_id: sub._id.toString()}}, '', 'kibochat')
            .then(session => {
              if (session) {
                SubscribersDataLayer.updateSubscriberObject(sub._id, {datetime: session.request_time})
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
                              let rDate = randomDate(new Date(startDate), new Date(endDate))
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

exports.addFullName = function (req, res) {
  logger.serverLog(TAG, 'Hit the scripts addFullName')
  SubscribersDataLayer.findSubscriberObjects({})
    .then(subscribers => {
      let requests = []
      if (subscribers.length > 0) {
        subscribers.forEach((subscriber, index) => {
          requests.push(new Promise((resolve, reject) => {
            SubscribersDataLayer.updateSubscriberObject(subscriber._id, {fullName: `${subscriber.firstName} ${subscriber.lastName}`})
              .then(update => {
                resolve({_id: subscriber._id, fullName: `${subscriber.firstName} ${subscriber.lastName}`})
              })
              .catch(err => {
                reject(err)
              })
          }))
        })
      }
      Promise.all(requests)
        .then((responses) => res.status(200).json({status: 'success', payload: responses}))
        .catch((err) => res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`}))
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${err}`})
    })
}

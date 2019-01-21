const logger = require('../../components/logger')
const TAG = '/api/scripts/controller.js'
const SusbscribersDataLayer = require('../v1/subscribers/subscribers.datalayer')
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

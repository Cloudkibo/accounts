const PageModel = require('../../v1/pages/Pages.model')
const needle = require('needle')
const logger = require('../../../components/logger')
const TAG = '/api/scripts/pages/controller.js'

exports.changeBroadcastApiLimit = function (req, res) {
  let limit = req.body.limit
  PageModel.update({}, {subscriberLimitForBatchAPI: limit}, {multi: true}).exec()
    .then(updated => {
      return res.status(200).json({status: 'success', payload: 'Updated successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to update pages ${err}`})
    })
}

exports.changeBroadcastApiLimitForOnePage = function (req, res) {
  let limit = req.body.limit
  PageModel.update({pageId: req.params.id}, {subscriberLimitForBatchAPI: limit}, {multi: true}).exec()
    .then(updated => {
      return res.status(200).json({status: 'success', payload: 'Updated successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to update pages ${err}`})
    })
}

exports.addConnectedFacebook = function (req, res) {
  let query = [
    {'$group': {
      '_id': '$pageId',
      'pageName': {'$first': '$pageName'},
      'accessToken': {'$last': '$accessToken'}
    }},
    {$project: {'_id': 0,
      'pageId': '$_id',
      'pageName': 1,
      accessToken: 1
    }},
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]
  PageModel.aggregate(query).exec()
    .then(pages => {
      console.log('pages.length', pages.length)
      let current = 0
      let interval = setInterval(() => {
        console.log('current', current)
        if (current === pages.length) {
          clearInterval(interval)
          return res.status(200).json({status: 'success', payload: 'Updated successfully!'})
        } else {
          needle('get', `https://graph.facebook.com/v2.6/${pages[current].pageId}/subscribed_apps?access_token=${pages[current].accessToken}`)
            .then(resp => {
              logger.serverLog(TAG, `response from facebook ${resp.body}`)
              updateConnectedFacebook(resp.body.data)
                .then(connectedFacebook => {
                  logger.serverLog(TAG, `connected facebook ${resp.body}`)
                  PageModel.update({pageId: pages[current].pageId}, {$set: {connectedFacebook: connectedFacebook}}, {multi: true}).exec()
                    .then(updated => {
                      current++
                    })
                    .catch(err => {
                      logger.serverLog(TAG, `Failed to update page ${err}`)
                      current++
                    })
                })
            })
            .catch(err => {
              logger.serverLog(TAG, `Failed to fetch subscribed_apps ${err}`)
              current++
            })
        }
      }, 3000)
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch pages ${err}`})
    })
}

function updateConnectedFacebook (data) {
  let connectedFacebook = false
  return new Promise((resolve, reject) => {
    if (data && data.length > 0) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].name.includes('KiboPush')) {
          connectedFacebook = true
        }
        if (j === data.length - 1) {
          resolve(connectedFacebook)
        }
      }
    } else {
      resolve(connectedFacebook)
    }
  })
}

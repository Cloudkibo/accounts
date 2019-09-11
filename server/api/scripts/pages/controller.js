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
    }}
  ]
  PageModel.aggregate(query).exec()
    .then(pages => {
      for (let i = 0; i < pages.length; i++) {
        needle('get', `https://graph.facebook.com/v2.6/${pages[i].pageId}/subscribed_apps?access_token=${pages[i].accessToken}`)
          .then(resp => {
            logger.serverLog(TAG, `response from facebook ${resp.body}`)
            updateConnectedFacebook(resp.body.data)
              .then(connectedFacebook => {
                logger.serverLog(TAG, `connected facebook ${resp.body}`)
                PageModel.update({pageId: pages[i].pageId}, {$set: {connectedFacebook: connectedFacebook}}, {multi: true}).exec()
                  .then(updated => {
                    if (i === pages.length - 1) {
                      return res.status(200).json({status: 'success', payload: 'Updated successfully!'})
                    }
                  })
                  .catch(err => {
                    logger.serverLog(TAG, `Failed to update page ${err}`)
                  })
              })
          })
          .catch(err => {
            logger.serverLog(TAG, `Failed to fetch subscribed_apps ${err}`)
          })
      }
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

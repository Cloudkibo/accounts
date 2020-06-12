const PageModel = require('../../v1/pages/Pages.model')
const UserModel = require('../../v1/user/user.model')
const needle = require('needle')
const logger = require('../../../components/logger')
const TAG = '/api/scripts/pages/controller.js'
const async = require('async')

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
          needle('get', `https://graph.facebook.com/v6.0/${pages[current].pageId}/subscribed_apps?access_token=${pages[current].accessToken}`)
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

exports.putTasks = (req, res) => {
  const limit = req.body.limit
  const skip = req.body.skip
  UserModel.aggregate([
    {$match: {facebookInfo: {$exists: true}}},
    {$skip: skip},
    {$limit: limit}
  ]).exec()
    .then(users => {
      if (users.length > 0) {
        async.each(users, _handleUser, function (err) {
          if (err) {
            logger.serverLog(TAG, err, 'error')
            return res.status(500).json({status: 'failed'})
          } else {
            return res.status(200).json({status: 'success'})
          }
        })
      } else {
        return res.status(200).json({status: 'success', description: 'No user found'})
      }
    })
    .catch(err => {
      logger.serverLog(TAG, err, 'error')
      return res.status(500).json({status: 'failed'})
    })
}

function _handleUser (user, cb) {
  needle(
    'get',
    `https://graph.facebook.com/v6.0/${user.facebookInfo.fbId}/accounts?limit=50&access_token=${user.facebookInfo.fbToken}`
  )
    .then(accounts => {
      logger.serverLog(TAG, user.name)
      async.each(accounts.body.data, function (item, next) {
        _putTasks(item, user._id, next)
      }, function (err) {
        if (err) {
          logger.serverLog(TAG, err, 'error')
        }
        cb()
      })
    })
    .catch(err => {
      logger.serverLog(TAG, err, 'error')
      cb()
    })
}

function _putTasks (item, userId, cb) {
  PageModel.update(
    {pageId: item.id, userId},
    {tasks: item.tasks},
    {multi: true}
  ).exec()
    .then(updated => {
      logger.serverLog(TAG, 'updated successfully!')
      cb()
    })
    .catch(err => {
      logger.serverLog(TAG, err, 'error')
      cb()
    })
}

exports.addEmailNumberInWelcomeMessage = function (req, res) {
  let query = [
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]
  PageModel.aggregate(query).exec()
    .then(pages => {
      console.log('pages.length', pages)
      if (pages.length > 0) {
        async.each(pages, _handlePage, function (err) {
          if (err) {
            logger.serverLog(TAG, err, 'error')
            return res.status(500).json({status: 'failed'})
          } else {
            return res.status(200).json({status: 'success'})
          }
        })
      } else {
        return res.status(200).json({status: 'success', description: 'No Pages found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch pages ${err}`})
    })
}

function _handlePage (page, cb) {
  let welcomeMessage = page.welcomeMessage
  let blockUniqueId = new Date().getTime()
  welcomeMessage.push({
    componentName: 'text',
    componentType: 'text',
    id: new Date().getTime(),
    text: 'Please share your Email Address with us',
    quickReplies: [{
      content_type: 'user_email',
      payload: JSON.stringify([
        {action: 'set_subscriber_field', fieldName: 'email'},
        {action: 'send_message_block', blockUniqueId: blockUniqueId}
      ]),
      title: 'Email Address'
    }]
  })
  console.log('welcomeMessage', welcomeMessage[1].quickReplies)
  cb()
}

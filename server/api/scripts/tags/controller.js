const logger = require('../../../components/logger')
const TAG = '/api/scripts/tags/controller.js'
const async = require('async')
const needle = require('needle')
const TagsModel = require('../../v1//tags/tags.model')
const TagSubscribersModel = require('../../v1//tags_subscriber/tags_subscriber.model')
const SubscribersModel = require('../../v1/subscribers/Subscribers.model')

exports.getAssignedTagInfo = (req, res) => {
  SubscribersModel.aggregate([
    {$skip: req.body.skip},
    {$limit: req.body.limit},
    {$lookup: {from: 'pages', localField: 'pageId', foreignField: '_id', as: 'pageId'}},
    {$unwind: '$pageId'}
  ]).exec()
    .then(subscribers => {
      if (subscribers.length > 0) {
        let pages = subscribers.map((s) => s.pageId._id.toString())
        pages = [...new Set(pages)]
        let data = {
          permissionErrors: [],
          incorrectSubscribers: [],
          incorrectTagRecords: 0,
          incorrectPermissionRecords: 0
        }
        async.eachSeries(pages, function (page, cb) {
          console.log('in async each', subscribers.length)
          data.subscribers = subscribers.filter((s) => s.pageId._id.toString() === page)
          console.log('subscribers length after filter', data.subscribers.length)
          data.pageId = page
          async.series([
            _fetchTags.bind(null, data),
            _fetchAssignedTags.bind(null, data)
          ], function (err) {
            if (err) {
              cb(err)
            } else {
              cb()
            }
          })
        }, function (err) {
          if (err) {
            logger.serverLog(TAG, err, 'error')
          } else {
            let payload = {
              permissionErrors: data.permissionErrors,
              incorrectTagRecords: data.incorrectTagRecords,
              incorrectSubscribers: data.incorrectSubscribers,
              incorrectPermissionRecords: data.incorrectPermissionRecords
            }
            return res.status(200).json({status: 'success', payload})
          }
        })
      } else {
        return res.status(200).json({status: 'success', payload: 'No subscribers found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'success', payload: err})
    })
}

exports.removeDefaultTags = (req, res) => {
  TagsModel.deleteMany({defaultTag: true}).exec()
    .then(deleted => {
      return res.status(200).json({status: 'success', payload: 'Deleted successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'Failed', payload: err})
    })
}

exports.removeDefaultTagSubscribers = (req, res) => {
  TagsModel.aggregate([
    {$match: {defaultTag: true}},
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(tags => {
      if (tags.length > 0) {
        let tagIds = tags.map((t) => t._id)
        TagSubscribersModel.deleteMany({tagId: {$in: tagIds}})
          .then(result => {
            return res.status(200).json({status: 'success', payload: 'Deleted successfully!'})
          })
          .catch(err => {
            return res.status(500).json({status: 'success', payload: err})
          })
      } else {
        return res.status(200).json({status: 'success', payload: 'No default tags found!'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'success', payload: err})
    })
}

exports.correctAssignedTags = (req, res) => {
  SubscribersModel.aggregate([
    {$skip: req.body.skip},
    {$limit: req.body.limit},
    {$lookup: {from: 'pages', localField: 'pageId', foreignField: '_id', as: 'pageId'}},
    {$unwind: '$pageId'}
  ]).exec()
    .then(subscribers => {
      if (subscribers.length > 0) {
        let pages = subscribers.map((s) => s.pageId._id.toString())
        let uniquePages = [...new Set(pages)]
        async.eachSeries(uniquePages, function (page, cb) {
          let data = {
            subscribers: subscribers.filter((s) => s.pageId._id.toString() === page),
            pageId: page
          }
          async.series([
            _fetchTags.bind(null, data),
            _correctAssignedTags.bind(null, data)
          ], function (err) {
            if (err) {
              cb(err)
            } else {
              cb()
            }
          })
        }, function (err) {
          if (err) {
            logger.serverLog(TAG, err, 'error')
          } else {
            return res.status(200).json({status: 'success'})
          }
        })
      } else {
        return res.status(200).json({status: 'success', payload: 'No subscribers found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'success', payload: err})
    })
}

function _fetchTags (data, next) {
  TagsModel.find({pageId: data.pageId, defaultTag: true}).exec()
    .then(tags => {
      if (tags.length > 0) {
        data.tags = tags
        next()
      } else {
        data.tags = []
        next()
      }
    })
    .catch(err => next(err))
}

function _fetchAssignedTags (data, next) {
  console.log('in _fetchAssignedTags', data.subscribers.length)
  let current = 0
  let interval = setInterval(() => {
    if (current === data.subscribers.length) {
      clearInterval(interval)
      next()
    } else {
      needle('get', `https://graph.facebook.com/v2.11/${data.subscribers[current].senderId}/custom_labels?fields=name&access_token=${data.subscribers[current].pageId.accessToken}&limit=50`)
        .then(response => {
          if (response.body.error) {
            data.permissionErrors.push({error: response.body.error, subscriberId: data.subscribers[current]._id})
            data.incorrectPermissionRecords += 1
            current++
          } else {
            let fbtags = response.body.data
            let localTagIds = data.tags.map((t) => t.labelFbId)
            let assignedTags = fbtags.filter((t) => localTagIds.includes(t.id))
            let assignedTagNames = assignedTags.map(t => t.name)
            let incorrectGender = ''
            if (data.subscribers[current].gender === 'male') {
              incorrectGender = 'female'
            } else {
              incorrectGender = 'male'
            }
            console.log('assignedTagNames', JSON.stringify(assignedTagNames))
            console.log('current', current)
            console.log(data.subscribers[current].gender)
            console.log(`_${data.subscribers[current].pageId.pageId}_1`)
            if (
              (assignedTagNames.includes(incorrectGender) || assignedTagNames.includes('other')) ||
              (!assignedTagNames.includes(data.subscribers[current].gender)) ||
              (!assignedTagNames.includes(`_${data.subscribers[current].pageId.pageId}_1`))
            ) {
              data.incorrectTagRecords += 1
              data.incorrectSubscribers.push(data.subscribers[current]._id)
              current++
            } else {
              current++
            }
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Failed to fetch assigned tags from facebook ${err}`)
          current++
        })
    }
  }, 3000)
}

function _correctAssignedTags (data, next) {
  let current = 0
  let interval = setInterval(() => {
    if (current === data.subscribers.length) {
      clearInterval(interval)
      next()
    } else {
      needle('get', `https://graph.facebook.com/v2.11/${data.subscribers[current].senderId}/custom_labels?fields=name&access_token=${data.subscribers[current].pageId.accessToken}&limit=50`)
        .then(response => {
          if (response.body.error) {
            current++
          } else {
            let fbtags = response.body.data
            let localTagIds = data.tags.map((t) => t.labelFbId)
            let localTagNames = data.tags.map((t) => t.tag)
            let assignedTags = fbtags.filter((t) => localTagIds.includes(t.id))
            let assignedTagNames = assignedTags.map(t => t.name)
            let incorrectGender = ''
            if (data.subscribers[current].gender === 'male') {
              incorrectGender = 'female'
            } else {
              incorrectGender = 'male'
            }
            console.log('assignedTagNames', JSON.stringify(assignedTagNames))
            console.log('localTagNames', JSON.stringify(localTagNames))
            if (assignedTagNames.includes(incorrectGender)) {
              let index = localTagNames.indexOf(incorrectGender)
              if (index !== -1) {
                let id = data.tags[index].labelFbId
                _unassignTag(id, data.subscribers[current])
              }
            }
            if (assignedTagNames.includes('other')) {
              let index = localTagNames.indexOf('other')
              if (index !== -1) {
                let id = data.tags[index].labelFbId
                _unassignTag(id, data.subscribers[current])
              }
            }
            if (!assignedTagNames.includes(data.subscribers[current].gender)) {
              let index = localTagNames.indexOf(data.subscribers[current].gender)
              if (index !== -1) {
                let id = data.tags[index].labelFbId
                _assignTag(id, data.subscribers[current])
              }
            }
            if (!assignedTagNames.includes(`_${data.subscribers[current].pageId.pageId}_1`)) {
              let index = localTagNames.indexOf(`_${data.subscribers[current].pageId.pageId}_1`)
              if (index !== -1) {
                let id = data.tags[index].labelFbId
                _assignTag(id, data.subscribers[current])
              }
            }
            current++
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Failed to fetch assigned tags from facebook ${err}`)
          current++
        })
    }
  }, 3000)
}

function _assignTag (fbid, subscriber) {
  needle('post', `https://graph.facebook.com/v2.11/${fbid}/label?access_token=${subscriber.pageId.accessToken}`, {'user': subscriber.senderId})
    .then(response => {
      if (response.body.error) {
        logger.serverLog(TAG, `Failed to assign tag ${JSON.stringify(response.body.error)}`)
      } else {
        logger.serverLog(TAG, 'Tag assigned successfully!')
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Failed to fetch assigned tags from facebook ${err}`)
    })
}

function _unassignTag (fbid, subscriber) {
  needle('delete', `https://graph.facebook.com/v2.11/${fbid}/label?user=${subscriber.senderId}&access_token=${subscriber.pageId.accessToken}`)
    .then(response => {
      if (response.body.error) {
        logger.serverLog(TAG, `Failed to assign tag ${JSON.stringify(response.body.error)}`)
      } else {
        logger.serverLog(TAG, 'Tag assigned successfully!')
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Failed to fetch assigned tags from facebook ${err}`)
    })
}

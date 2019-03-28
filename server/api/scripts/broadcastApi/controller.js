const logger = require('../../../components/logger')
const TAG = '/api/scripts/broadcastApi/controller.js'
const async = require('async')
const needle = require('needle')
const TagsModel = require('../../v1//tags/tags.model')
const ListModel = require('../../v1/lists/Lists.model')
const PageModel = require('../../v1/pages/Pages.model')
const TagSubscribersModel = require('../../v1/tags_subscriber/tags_subscriber.model')
const SubscribersModel = require('../../v1/subscribers/Subscribers.model')
const util = require('util')

exports.normalizeTagsDataForPageId = function (req, res) {
  TagsModel.find({pageId: null}).exec()
    .then(tags => {
      async.each(tags, insertPageId, function (err, results) {
        if (err) {
          return res.status(500).json({status: 'failed', payload: `Failed to insert pageId ${err}`})
        }
        return res.status(200).json({status: 'success', payload: 'Normalized successfully!'})
      })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch tags ${err}`})
    })
}

function insertPageId (tag, callback) {
  PageModel.find({companyId: tag.companyId}).exec()
    .then(pages => {
      if (pages.length > 0) {
        TagsModel.update({_id: tag._id}, {pageId: pages[0]._id, defaultTag: false, isList: false}).exec()
          .then(updated => {
            for (let i = 1; i < pages.length; i++) {
              let data = {
                tag: tag.tag,
                userId: tag.userId,
                companyId: tag.companyId,
                pageId: pages[i]._id
              }
              const tagsPayload = new TagsModel(data)
              tagsPayload.save()
                .then(saved => logger.serverLog(TAG, 'tag created'))
                .catch(err => logger.serverLog(TAG, `Failed to create tag ${err}`))
            }
            callback(null, 'success')
          })
          .catch(err => callback(err))
      } else {
        callback(null, 'success')
      }
    })
    .catch(err => callback(err))
}

exports.normalizeListsData = function (req, res) {
  ListModel.find({}).exec()
    .then(lists => {
      async.each(lists, createTag, function (err, results) {
        if (err) {
          return res.status(500).json({status: 'failed', payload: `Failed to create tag ${err}`})
        }
        return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
      })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch lists ${err}`})
    })
}

function createTag (list, callback) {
  PageModel.find({companyId: list.companyId}).exec()
    .then(pages => {
      pages.forEach(page => {
        let data = {
          tag: list.listName,
          userId: list.userId,
          companyId: list.companyId,
          pageId: page._id,
          isList: true
        }
        const tagsPayload = new TagsModel(data)
        tagsPayload.save()
          .then(saved => logger.serverLog(TAG, 'tag created'))
          .catch(err => logger.serverLog(TAG, `Failed to create tag ${err}`))
      })
      callback(null, 'success')
    })
    .catch(err => callback(err))
}

function validAccessToken (page) {
  needle('get', `https://graph.facebook.com/v2.6/me?access_token=${page.accessToken}`)
    .then(resp => {
      if (resp.body.error) {
        logger.serverLog(TAG, `Failed to validAccessToken ${resp.body.error}`)
        return false
      } else {
        return true
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Failed to validAccessToken ${err}`)
      return false
    })
}

exports.normalizeTagsData = function (req, res) {
  TagsModel.aggregate([
    {$match: {labelFbId: null}},
    {$group: {_id: '$pageId'}}
  ]).exec()
    .then(uniquePages => {
      if (uniquePages.length > 0) {
        uniquePages.forEach((up, i) => {
          PageModel.findOne({_id: up._id}).populate('userId').exec()
            .then(page => {
              TagsModel.find({pageId: page._id}).exec()
                .then(tags => {
                  if (page && validAccessToken(page)) {
                    async.each(tags, function (tag, callback) {
                      createTagOnFacebook(tag, page.accessToken, callback)
                    }, function (err, results) {
                      if (err) {
                        return res.status(500).json({status: 'failed', payload: `Failed to create tag on facebook ${err}`})
                      } else if (uniquePages.length - 1 === i) {
                        return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
                      }
                    })
                  } else if (page && !validAccessToken(page) && page.userId && page.userId.facebookInfo) {
                    needle('get', `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`)
                      .then(resp => {
                        console.log('get accessToken response', util.inspect(resp))
                        let accessToken = resp.body.accessToken
                        async.each(tags, function (tag, callback) {
                          createTagOnFacebook(tag, accessToken, callback)
                        }, function (err, results) {
                          if (err) {
                            return res.status(500).json({status: 'failed', payload: `Failed to create tag on facebook ${err}`})
                          } else if (uniquePages.length - 1 === i) {
                            return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
                          }
                        })
                      })
                      .catch(err => {
                        return res.status(500).json({status: 'failed', payload: `Failed to fetch accessToken ${err}`})
                      })
                  } else {
                    if (uniquePages.length - 1 === i) {
                      return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
                    }
                  }
                })
                .catch(err => {
                  return res.status(500).json({status: 'failed', payload: `Failed to fetch tags ${err}`})
                })
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to fetch page ${err}`})
            })
        })
      } else {
        return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch tags ${err}`})
    })
}

function createTagOnFacebook (tag, accessToken, callback) {
  needle(
    'post',
    `https://graph.facebook.com/v2.11/me/custom_labels?access_token=${accessToken}`,
    {'name': tag.tag}
  )
    .then(label => {
      console.log('get label response', util.inspect(label))
      if (label.body.error) {
        callback(label.body.error)
      } else {
        TagsModel.update({_id: tag._id}, {labelFbId: label.body.id}).exec()
          .then(updated => {
            callback(null, updated)
          })
          .catch(err => callback(err))
      }
    })
    .catch(err => {
      console.log('get label error', util.inspect(err))
      callback(err)
    })
}

exports.normalizePagesData = function (req, res) {
  PageModel.find({connected: true}).exec()
    .then(pages => {
      async.each(pages, updatePage, function (err, results) {
        if (err) {
          return res.status(500).json({status: 'failed', payload: `failed to fetch connected pages ${err}`})
        }
        return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
      })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `failed to fetch connected pages ${err}`})
    })
}

function updatePage (page, callback) {
  needle('post', `https://graph.facebook.com/v2.11/me/broadcast_reach_estimations?access_token=${page.accessToken}`)
    .then(reachEstimation => {
      if (reachEstimation.body.error) {
        callback(reachEstimation.body.error)
      }
      PageModel.update({_id: page._id}, {reachEstimationId: reachEstimation.body.reach_estimation_id, subscriberLimitForBatchAPI: 100}).exec()
        .then(updated => {
          callback(null, updated)
        })
        .catch(err => callback(err))
    })
    .catch(err => callback(err))
}

exports.normalizeTagSubscribers = function (req, res) {
  TagSubscribersModel.find({}).populate('subscriberId').exec()
    .then(tagSubscribers => {
      TagSubscribersModel.aggregate([
        {$lookup: {from: 'tags', localField: 'tagId', foreignField: '_id', as: 'tagId'}},
        {$unwind: '$tagId'},
        {$group: {_id: {tag: '$tagId.tag', companyId: '$companyId'}}}
      ]).exec()
        .then(uniqueTags => {
          TagSubscribersModel.deleteMany({}).exec()
            .then(deleted => {
              uniqueTags.forEach(ut => {
                TagsModel.find({tag: ut._id.tag, companyId: ut._id.companyId}).populate('pageId').exec()
                  .then(tags => {
                    tags.forEach(tag => {
                      let subscribers = tagSubscribers.filter((ts) => ts.companyId === tag.companyId).map(ts => ts.subscriberId)
                      assignTagToSubscribers(tag, subscribers)
                    })
                  })
                  .catch(err => {
                    logger.serverLog(TAG, `failed to fetch tags ${err}`)
                  })
              })
              return res.status(200).json({status: 'success', payload: 'Normalized successfully!'})
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to fetch tag subscribers ${err}`})
            })
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: `Failed to fetch tag subscribers aggreagte ${err}`})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch tag subscribers ${err}`})
    })
}

function assignTagToSubscribers (tag, subscribers) {
  subscribers.forEach((subscriber, i) => {
    needle('post', `https://graph.facebook .com/v2.11/me/${tag.labelFbId}/label?access_token=${tag.pageId.accessToken}`, 'post', {'user': subscriber.senderId})
      .then(assignedLabel => {
        if (assignedLabel.body.error) logger.serverLog(TAG, `failed to associate subscriber to tag ${assignedLabel.body.error}`)
        let subscriberTagsPayload = {
          tagId: tag._id,
          subscriberId: subscriber._id,
          companyId: tag.companyId
        }
        const tagSubscriber = new TagSubscribersModel(subscriberTagsPayload)
        tagSubscriber.save()
      })
      .catch(err => logger.serverLog(TAG, `failed to associate subscriber to tag ${err}`))
  })
}

exports.normalizeTagSubscribersDefault = function (req, res) {
  TagsModel.find({defaultTag: true}).populate('pageId').exec()
    .then(tags => {
      tags.forEach(tag => {
        SubscribersModel.find({companyId: tag.companyId}).exec()
          .then(subscribers => {
            assignTagToSubscribers(tag, subscribers)
            return res.status(200).json({status: 'success', payload: 'Normalized successfully!'})
          })
          .catch(err => {
            return res.status(500).json({status: 'failed', payload: `Faild to fetch subscribers ${err}`})
          })
      })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Faild to fetch tags ${err}`})
    })
}

exports.normalizeTagSubscribersList = function (req, res) {
  TagsModel.find({isList: true}).populate('pageId').exec()
    .then(tags => {
      tags.forEach(tag => {
        ListModel.findOne({listName: tag.tag, companyId: tag.companyId}).exec()
          .then(list => {
            SubscribersModel.find({_id: {$in: list.content}}).exec()
              .then(subscribers => {
                assignTagToSubscribers(tag, subscribers)
              })
              .catch(err => {
                return res.status(500).json({status: 'failed', payload: `Faild to fetch subscribers ${err}`})
              })
          })
          .catch(err => {
            return res.status(500).json({status: 'failed', payload: `Faild to fetch list ${err}`})
          })
      })
      return res.status(200).json({status: 'success', payload: 'Normalized successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Faild to fetch tags ${err}`})
    })
}

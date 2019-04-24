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
        let up = uniquePages[0]
        PageModel.findOne({_id: up._id}).populate('userId').exec()
          .then(page => {
            TagsModel.find({pageId: page._id}).exec()
              .then(tags => {
                if (page && validAccessToken(page)) {
                  createTagOnFacebook(tags, page.accessToken, 300, res)
                } else if (page && !validAccessToken(page) && page.userId && page.userId.facebookInfo) {
                  needle('get', `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`)
                    .then(resp => {
                      console.log('get accessToken response', util.inspect(resp))
                      let accessToken = resp.body.access_token
                      if (accessToken) {
                        createTagOnFacebook(tags, accessToken, 300, res)
                      } else {
                        return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
                      }
                    })
                    .catch(err => {
                      return res.status(500).json({status: 'failed', payload: `Failed to fetch accessToken ${err}`})
                    })
                } else {
                  return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
                }
              })
              .catch(err => {
                return res.status(500).json({status: 'failed', payload: `Failed to fetch tags ${err}`})
              })
          })
          .catch(err => {
            return res.status(500).json({status: 'failed', payload: `Failed to fetch page ${err}`})
          })
      } else {
        return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch tags ${err}`})
    })
}

function createTagOnFacebook (array, accessToken, delay, res) {
  let current = 0
  let interval = setInterval(() => {
    if (current === array.length) {
      clearInterval(interval)
      return res.status(200).json({status: 'success', payload: `Normalized successfully!`})
    } else {
      needle(
        'post',
        `https://graph.facebook.com/v2.11/me/custom_labels?access_token=${accessToken}`,
        {'name': array[current].tag}
      )
        .then(label => {
          console.log('get label response', util.inspect(label.body))
          if (label.body.error) {
            return res.status(500).json({status: 'failed', payload: `Failed to create tag on facebook ${label.body.error}`})
          } else {
            TagsModel.update({_id: array[current]._id}, {labelFbId: label.body.id}).exec()
              .then(updated => {
                console.log('updated successfully!')
                current++
              })
              .catch(err => {
                return res.status(500).json({status: 'failed', payload: `Failed to create tag on facebook ${err}`})
              })
          }
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: `Failed to create tag on facebook ${err}`})
        })
    }
  }, delay)
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

exports.normalizeDefaultTags = function (req, res) {
  PageModel.aggregate([
    {$match: {connected: true}},
    {$group: {_id: '$userId'}},
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(uniqueUsers => {
      if (uniqueUsers.length > 0) {
        for (let i = 0; i < uniqueUsers.length; i++) {
          PageModel.find({userId: uniqueUsers[i]._id, connected: true}).exec()
            .then(pages => {
              createDefaultTags(pages, 3000)
              if (i === uniqueUsers.length - 1) {
                return res.status(200).json({status: 'success', payload: 'Normalized successfully!'})
              }
            })
            .catch(err => logger.serverLog(TAG, `failed to fetch pages ${err}`))
        }
      } else {
        return res.status(404).json({status: 'failed', payload: 'No user found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Faild to fetch uniqueUsers ${err}`})
    })
}

function createDefaultTags (pages, delay) {
  let current = 0
  let interval = setInterval(() => {
    if (current === pages.length) {
      clearInterval(interval)
    } else {
      needle('get', `https://graph.facebook.com/v2.11/me/custom_labels?fields=name&access_token=${pages[current].accessToken}&limit=50`)
        .then(labelResp => {
          if (labelResp.body.error) {
            logger.serverLog(TAG, `Failed to fetch labels ${JSON.stringify(labelResp.body.error)}`)
            current++
          } else {
            logger.serverLog(TAG, `Fetch labels response ${JSON.stringify(labelResp.body.data.length)}`)
            let fblabels = labelResp.body.data
            let fbtags = fblabels.length > 0 && fblabels.map((l) => l.name)
            TagsModel.find({pageId: pages[current]._id, defaultTag: true}).exec()
              .then(tags => {
                if (tags.length > 0) {
                  let localtags = tags.map((t) => t.tag)
                  if (fbtags.includes(`_${pages[current].pageId}_1`) && !localtags.includes(`_${pages[current].pageId}_1`)) {
                    createDefaultTag(`_${pages[current].pageId}_1`, pages[current], fblabels.filter((l) => l.name === `_${pages[current].pageId}_1`)[0].id)
                  } else if (!localtags.includes(`_${pages[current].pageId}_1`)) {
                    createDefaultTagFb(pages[current], `_${pages[current].pageId}_1`)
                  }
                  if (fbtags.includes('male') && !localtags.includes('male')) {
                    createDefaultTag('male', pages[current], fblabels.filter((l) => l.name === 'male')[0].id)
                  } else if (!localtags.includes('male')) {
                    createDefaultTagFb(pages[current], 'male')
                  }
                  if (fbtags.includes('female') && !localtags.includes('female')) {
                    createDefaultTag('female', pages[current], fblabels.filter((l) => l.name === 'female')[0].id)
                  } else if (!localtags.includes('female')) {
                    createDefaultTagFb(pages[current], 'female')
                  }
                  if (fbtags.includes('other') && !localtags.includes('other')) {
                    createDefaultTag('other', pages[current], fblabels.filter((l) => l.name === 'other')[0].id)
                  } else if (!localtags.includes('other')) {
                    createDefaultTagFb(pages[current], 'other')
                  }
                  current++
                } else {
                  if (fbtags.includes(`_${pages[current].pageId}_1`)) {
                    createDefaultTag(`_${pages[current].pageId}_1`, pages[current], fblabels.filter((l) => l.name === `_${pages[current].pageId}_1`)[0].id)
                  } else {
                    createDefaultTagFb(pages[current], `_${pages[current].pageId}_1`)
                  }
                  if (fbtags.includes('male')) {
                    createDefaultTag('male', pages[current], fblabels.filter((l) => l.name === 'male')[0].id)
                  } else {
                    createDefaultTagFb(pages[current], 'male')
                  }
                  if (fbtags.includes('female')) {
                    createDefaultTag('female', pages[current], fblabels.filter((l) => l.name === 'female')[0].id)
                  } else {
                    createDefaultTagFb(pages[current], 'female')
                  }
                  if (fbtags.includes('other')) {
                    createDefaultTag('other', pages[current], fblabels.filter((l) => l.name === 'other')[0].id)
                  } else {
                    createDefaultTagFb(pages[current], 'other')
                  }
                  current++
                }
              })
              .catch(err => {
                logger.serverLog(TAG, `Failed to fetch tags ${err}`)
                current++
              })
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Failed to fetch labels ${err}`)
          current++
        })
    }
  }, delay)
}

function createDefaultTag (label, page, fbid) {
  let tagData = {
    isList: false,
    defaultTag: true,
    tag: label,
    userId: page.userId,
    companyId: page.companyId,
    pageId: page._id,
    labelFbId: fbid
  }
  let TagObj = new TagsModel(tagData)
  TagObj.save()
  logger.serverLog(TAG, `Tag ${label} created successfully!`)
}

function createDefaultTagFb (page, label) {
  needle('post', `https://graph.facebook.com/v2.11/me/custom_labels?access_token=${page.accessToken}`, {'name': label})
    .then(response => {
      if (response.body.error) {
        logger.serverLog(TAG, `Failed to create tag on facebook ${JSON.stringify(response.body.error)}`)
      } else {
        createDefaultTag(label, page, response.body.id)
      }
    })
    .catch(err => logger.serverLog(TAG, `Failed to create tag on facebook ${err}`))
}

exports.associateDefaultTags = function (req, res) {
  SubscribersModel.aggregate([
    {$skip: req.body.skip},
    {$limit: req.body.limit},
    {$lookup: {from: 'pages', localField: 'pageId', foreignField: '_id', as: 'pageId'}},
    {$unwind: '$pageId'}
  ]).exec()
    .then(subscribers => {
      if (subscribers.length > 0) {
        let pages = subscribers.map((s) => s.pageId._id)
        let uniquePages = [...new Set(pages)]
        for (let i = 0; i < uniquePages.length; i++) {
          TagsModel.find({pageId: uniquePages[i], defaultTag: true}).exec()
            .then(tags => {
              if (tags.length > 0) {
                let subs = subscribers.filter((s) => s.pageId._id === uniquePages[i])
                associateDefaultTag(subs, tags, 3000)
              }
            })
            .catch(err => logger.serverLog(TAG, `Failed to fetch defaultTags ${err}`))
          if (i === uniquePages.length - 1) {
            return res.status(200).json({status: 'success', payload: 'Normalized successfully!'})
          }
        }
      } else {
        return res.status(404).json({status: 'failed', payload: 'No subscribers found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Faild to fetch subscribers ${err}`})
    })
}

function associateDefaultTag (subscribers, tags, delay) {
  let current = 0
  let interval = setInterval(() => {
    if (current === subscribers.length) {
      clearInterval(interval)
    } else {
      needle('get', `https://graph.facebook.com/v2.11/${subscribers[current].senderId}/custom_labels?fields=name&access_token=${subscribers[current].pageId.accessToken}&limit=50`)
        .then(response => {
          if (response.body.error) {
            logger.serverLog(TAG, `Failed to fetch assigned tags from facebook ${JSON.stringify(response.body.error)}`)
            current++
          } else {
            let fbtags = response.body.data
            let assignedTags = fbtags.map((t) => t.id)
            for (let i = 0; i < tags.length; i++) {
              if (!assignedTags.includes(tags[i].labelFbId)) {
                assignTag(tags[i].labelFbId, subscribers[current])
              }
              if (i === tags.length - 1) {
                current++
              }
            }
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Failed to fetch assigned tags from facebook ${err}`)
          current++
        })
    }
  }, delay)
}

function assignTag (fbid, subscriber) {
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

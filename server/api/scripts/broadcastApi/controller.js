const logger = require('../../../components/logger')
const TAG = '/api/scripts/broadcastApi/controller.js'
const async = require('async')
const needle = require('needle')
const TagsModel = require('../../v1//tags/tags.model')
const ListModel = require('../../v1/lists/Lists.model')
const PageModel = require('../../v1/pages/Pages.model')

exports.normalizeTagsDataForPageId = function (req, res) {
  TagsModel.find({pageId: null}).exec()
    .then(tags => {
      async.each(tags, insertPageId, function (err, results) {
        if (err) {
          return res.status(500).json({status: 'failed', payload: `Failed to insert pageId ${err}`})
        }
        return res.status(200).json({status: 'failed', payload: 'Normalized successfully!'})
      })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch tags ${err}`})
    })
}

function insertPageId (tag, callback) {
  PageModel.find({companyId: tag.companyId}).exec()
    .then(pages => {
      TagsModel.update({_id: tag._id}, {pageId: pages[0]._id}).exec()
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
        return res.status(200).json({status: 'failed', payload: `Normalized successfully!`})
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

exports.normalizeTagsData = function (req, res) {
  TagsModel.find({labelFbId: null}).populate('pageId').exec()
    .then(tags => {
      async.each(tags, createTagOnFacebook, function (err, results) {
        if (err) {
          return res.status(500).json({status: 'failed', payload: `Failed to create tag on facebook ${err}`})
        }
        return res.status(200).json({status: 'failed', payload: `Normalized successfully!`})
      })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch tags ${err}`})
    })
}

function createTagOnFacebook (tag, callback) {
  needle(
    'post',
    `https://graph.facebook.com/v2.11/me/custom_labels?access_token=${tag.pageId.accessToken}`,
    {'name': tag.tag}
  )
    .then(label => {
      if (label.body.error) callback(label.body.error)
      TagsModel.update({_id: tag._id}, {labelFbId: label.body.id}).exec()
        .then(updated => {
          callback(null, updated)
        })
        .catch(err => callback(err))
    })
    .catch(err => callback(err))
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

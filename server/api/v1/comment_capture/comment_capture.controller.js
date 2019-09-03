const logger = require('../../../components/logger')
const logicLayer = require('./comment_capture.logiclayer')
const dataLayer = require('./comment_capture.datalayer')
const TAG = '/api/v1/comment_capture/comment_capture.controller.js'
const needle = require('needle')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find post controller index')

  dataLayer.findOnePostObjectUsingQuery({_id: req.params.id})
    .then(post => {
      sendSuccessResponse(res, 200, post)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create post controller index')
  dataLayer.createPostObject(logicLayer.preparePostPayload(req.body))
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update post controller index')
  dataLayer.genericUpdatePostObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete post controller index')
  // delete post from facebook
  dataLayer.findOnePostObjectUsingQuery({_id: req.params.id})
    .then(post => {
      return needle.request('delete', `https://graph.facebook.com/v3.2/${post.post_id}?access_token=${post.pageId.accessToken}`, null)
    })
    // delete post from database
    .then(result => {
      return dataLayer.deletePostObject(req.params.id)
    })
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

//This is only to delete from our database, not facebook
exports.deleteLocally = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete post locally controller index')

  // delete post from database
    dataLayer.deleteOneUsingQuery(req.body.post_id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findAllPostObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregateFetch = function (req, res) {
  logger.serverLog(TAG, 'Hit the genericFetch controller index')

  dataLayer
    .findPostObjectUsingAggregate(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at generic fetch ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePostObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

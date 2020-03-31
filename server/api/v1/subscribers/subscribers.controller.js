const logger = require('../../../components/logger')
const logicLayer = require('./subscribers.logiclayer')
const subscribersDataLayer = require('./subscribers.datalayer')
const companyUsersDataLayer = require('../companyuser/companyuser.datalayer')
const pagesDataLayer = require('../pages/pages.datalayer')
const TAG = '/api/v1/subscribers/subscribers.controller.js'
const needle = require('needle')
const util = require('util')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find subscriber controller index')

  subscribersDataLayer.findOneSubscriberObject(req.params._id)
    .then(subscriberObject => {
      sendSuccessResponse(res, 200, subscriberObject)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, `Hit the create subscriber controller index ${JSON.stringify(req.body)}`, 'info', true)
  subscribersDataLayer.findSubscriberObjects({senderId: req.body.senderId, pageId: req.body.pageId, companyId: req.body.companyId})
    .then(subscribers => {
      if (subscribers.length === 0) {
        subscribersDataLayer.createSubscriberObject(req.body)
          .then(result => {
            sendSuccessResponse(res, 200, result)
          })
          .catch(err => {
            sendErrorResponse(res, 500, err)
          })
      } else {
        sendSuccessResponse(res, 200, subscribers[0])
      }
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update subscriber controller index')

  subscribersDataLayer.updateSubscriberObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete subscriber controller index')

  subscribersDataLayer.deleteSubscriberObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for subscriber controller')
  // logicLayer.convertPageID(req.body)
  req.body = logicLayer.convertIdtoObjectId(req.body)
  subscribersDataLayer.findSubscriberObjects(req.body)
    .then(result => {
      logger.serverLog(TAG, `query endpoint for subscriber found result ${util.inspect(result)}`)
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, `Hit the aggregate endpoint for subscriber controller: ${util.inspect(req.body)}`)
  let query = logicLayer.validateAndConvert(req.body)
  logger.serverLog(TAG, `after conversion query ${util.inspect(query)}`)
  //   logger.serverLog(TAG, `after conversion query ${util.inspect(query[0].$match.datetime)}`)
  //   logger.serverLog(TAG, `after conversion query ${util.inspect(query[0].$match.pageId)}`)
  subscribersDataLayer.aggregateInfo(query)
    .then(result => {
      logger.serverLog(TAG, `aggregate endpoint for subscriber found result ${util.inspect(result)}`)
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate subscriber ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  subscribersDataLayer.genericUpdateSubscriberObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.updatePicture = function (req, res) {
  let subscriber = req.body.subscriber
  let accessToken = subscriber.pageId.accessToken
  logger.serverLog(TAG, `https://graph.facebook.com/v2.10/${subscriber.senderId}?access_token=${accessToken}`)
  needle.get(
    `https://graph.facebook.com/v2.10/${subscriber.senderId}?access_token=${accessToken}`,
    (err, resp) => {
      if (err) {
        logger.serverLog(TAG, `error in retrieving https://graph.facebook.com/v2.10/${subscriber.senderId}?access_token=${accessToken} ${JSON.stringify(err)}`, 'error')
      }
      if (resp.body.profile_pic) {
        subscribersDataLayer.genericUpdateSubscriberObject({senderId: subscriber.senderId}, {profilePic: resp.body.profile_pic}, {})
          .then(updated => {
            logger.serverLog(TAG, `Succesfully updated subscriber with senderId ${subscriber.senderId}`)
            sendSuccessResponse(res, 200, resp.body.profile_pic)
          })
          .catch(err => {
            logger.serverLog(TAG, `Failed to update subscriber ${JSON.stringify(err)}`)
            sendErrorResponse(res, 500, err)
          })
      } else {
        sendErrorResponse(res, 404, `profile picture not found for subscriber with senderId ${subscriber.senderId}`)
      }
    })
}

exports.updateData = function (req, res) {
  companyUsersDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({userId: req.user.userId})
    .then(companyUser => {
      let companyId = companyUser.companyId
      subscribersDataLayer.findSubscriberObjects({companyId: companyId})
        .then(users => {
          let requests = []
          for (let i = 0; i < users.length; i++) {
            requests.push(new Promise((resolve, reject) => {
              pagesDataLayer.findOnePageObject(users[i].pageId)
                .then(page => {
                  let accessToken = page.accessToken
                  logger.serverLog(TAG, `https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${accessToken}`)
                  needle.get(
                    `https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${accessToken}`,
                    (err, resp) => {
                      if (err) {
                        logger.serverLog(TAG, `error in retrieving https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${accessToken} ${JSON.stringify(err)}`, 'error')
                      }
                      subscribersDataLayer.genericUpdateSubscriberObject({_id: users[i]._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, {})
                        .then(updated => {
                          resolve(users[i]._id)
                          logger.serverLog(TAG, `Succesfully updated subscriber ${users[i]._id}`)
                        })
                        .catch(err => {
                          reject(err)
                          logger.serverLog(TAG, `Failed to update subscriber ${JSON.stringify(err)}`)
                        })
                    })
                })
                .catch(err => {
                  reject(err)
                })
            }))
          }
          Promise.all(requests)
            .then((responses) => sendSuccessResponse(res, 200, responses))
            .catch((err) => sendErrorResponse(res, 500, err))
        })
        .catch(err => {
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

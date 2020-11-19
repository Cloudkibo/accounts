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
  subscribersDataLayer.findOneSubscriberObject(req.params._id)
    .then(subscriberObject => {
      sendSuccessResponse(res, 200, subscriberObject)
    })
    .catch(err => {
      const message = err || 'Failed to fetch subscriber record'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  subscribersDataLayer.findSubscriberObjects({senderId: req.body.senderId, pageId: req.body.pageId, companyId: req.body.companyId})
    .then(subscribers => {
      if (subscribers.length === 0) {
        subscribersDataLayer.createSubscriberObject(req.body)
          .then(result => {
            sendSuccessResponse(res, 200, result)
          })
          .catch(err => {
            const message = err || 'Failed to create subscriber record'
            logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
            sendErrorResponse(res, 500, err)
          })
      } else {
        sendSuccessResponse(res, 200, subscribers[0])
      }
    })
    .catch(err => {
      const message = err || 'Failed to fetch subscriber record'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  subscribersDataLayer.updateSubscriberObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update subscriber record'
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  subscribersDataLayer.deleteSubscriberObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete subscriber record'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  // logicLayer.convertPageID(req.body)
  req.body = logicLayer.convertIdtoObjectId(req.body)
  subscribersDataLayer.findSubscriberObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to fetch subscriber record'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  let query = logicLayer.validateAndConvert(req.body)
  //   logger.serverLog(TAG, `after conversion query ${util.inspect(query[0].$match.datetime)}`)
  //   logger.serverLog(TAG, `after conversion query ${util.inspect(query[0].$match.pageId)}`)
  subscribersDataLayer.aggregateInfo(query)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate subscriber record'
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  subscribersDataLayer.genericUpdateSubscriberObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update subscriber record'
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.updatePicture = function (req, res) {
  let subscriber = req.body.subscriber
  let accessToken = subscriber.pageId.accessToken
  needle.get(
    `https://graph.facebook.com/v6.0/${subscriber.senderId}?access_token=${accessToken}`,
    (err, resp) => {
      if (err) {
        const message = err || 'Failed to fetch subscriber Data from facebook'
        logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
      }
      if (resp.body.profile_pic) {
        subscribersDataLayer.genericUpdateSubscriberObject({senderId: subscriber.senderId}, {profilePic: resp.body.profile_pic}, {})
          .then(updated => {
            sendSuccessResponse(res, 200, resp.body.profile_pic)
          })
          .catch(err => {
            const message = err || 'Failed to update subscriber record'
            logger.serverLog(message, `${TAG}: exports.updatePicture`, req.body, {user: req.user}, 'error')      
            sendErrorResponse(res, 500, err)
          })
      } else {
        const message = `profile picture not found for subscriber with senderId ${subscriber.senderId}`
        logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
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
                  needle.get(
                    `https://graph.facebook.com/v6.0/${users[i].senderId}?access_token=${accessToken}`,
                    (err, resp) => {
                      if (err) {
                        const message = err || 'Failed to fetch user data from Facebook '
                        logger.serverLog(message, `${TAG}: exports.updateData`, req.body, {user: req.user}, 'error')
                      }
                      subscribersDataLayer.genericUpdateSubscriberObject({_id: users[i]._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, {})
                        .then(updated => {
                          resolve(users[i]._id)
                        })
                        .catch(err => {
                          reject(err)
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
            .catch((err) => {
              const message = err || 'Failed to update Data'
              logger.serverLog(message, `${TAG}: exports.updateData`, req.body, {user: req.user}, 'error')
              sendErrorResponse(res, 500, err)
            })
        })
        .catch(err => {
          const message = err || 'Failed to Fetch subscriber'
          logger.serverLog(message, `${TAG}: exports.updateData`, req.body, {user: req.user}, 'error')          
          sendErrorResponse(res, 500, err)
        })
    })
    .catch(err => {
      const message = err || 'Failed to Fetch CompanyUser'
      logger.serverLog(message, `${TAG}: exports.updateData`, req.body, {user: req.user}, 'error')      
      sendErrorResponse(res, 500, err)
    })
}

const logger = require('../../components/logger')
const TAG = '/api/scripts/controller.js'
const SubscribersDataLayer = require('../v1/subscribers/subscribers.datalayer')
const SubscribersModel = require('../v1/subscribers/Subscribers.model')
const PagesModel = require('../v1/pages/Pages.model')
const PostsModel = require('../v1/comment_capture/comment_capture.model')
const ReferralModel = require('../v1/pageReferrals/pageReferrals.model')
const MenuModel = require('../v1/menu/Menu.model')
const UserModel = require('../v1/user/user.model')
const CompanyUsers = require('../v1/companyuser/companyuser.model')
const CompanyProfilesModel = require('../v1/companyprofile/companyprofile.model')
const ContactModel = require('../v1/whatsAppContacts/whatsAppContacts.model')
const { callApi } = require('./apiCaller')
const async = require('async')
const config = require('./../../config/environment/index')
const needle = require('needle')

exports.normalizeCompanyUsers = function (req, res) {
  CompanyUsers.aggregate([
    {$lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'userId'}},
    {$unwind: { path: '$userId', 'preserveNullAndEmptyArrays': true }},
    {$match: {userId: null}}
  ]).exec()
    .then(companyUsers => {
      const ids = companyUsers.map((cu) => cu._id)
      CompanyUsers.deleteMany({_id: {$in: ids}}).exec()
        .then(deleted => res.status(200).json({status: 'success'}))
        .catch(err => res.status(500).json({status: 'Failed', payload: err}))
    })
    .catch(err => res.status(500).json({status: 'Failed', payload: err}))
}

exports.normalizeSubscribersDatetime = function (req, res) {
  logger.serverLog(TAG, 'Hit the scripts normalizeDatetime')
  SubscribersDataLayer.findSubscriberObjects({})
    .then(subscribers => {
      if (subscribers.length > 0) {
        subscribers.forEach((sub, index) => {
          callApi(`sessions/query`, 'post', {purpose: 'findOne', match: {subscriber_id: sub._id.toString()}}, '', 'kibochat')
            .then(session => {
              if (session) {
                SubscribersDataLayer.updateSubscriberObject(sub._id, {datetime: session.request_time})
                  .then(updated => {
                    if (index === (subscribers.length - 1)) {
                      return res.status(200).json({ status: 'success', payload: 'Normalized successfully!' })
                    }
                  })
                  .catch(err => {
                    return res.status(500).json({status: 'failed', payload: `Failed to update subscriber ${err}`})
                  })
              }
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to fetch sessions ${err}`})
            })
        })
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${err}`})
    })
}

function randomDate (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

exports.normalizeSubscribersDataLastActivity = function (req, res) {
  logger.serverLog(TAG, 'Hit the scripts normalizeDatetime')
  SubscribersModel.aggregate([
    {$match: {last_activity_time: {$exists: false}}},
    {$skip: req.body.skip},
    {$limit: req.body.limit}]).exec()
    .then(subscribers => {
      let requests = []
      if (subscribers.length > 0) {
        subscribers.forEach((subscriber, index) => {
          requests.push(new Promise((resolve, reject) => {
            SubscribersDataLayer.updateSubscriberObject(subscriber._id, {$set: {'last_activity_time': subscriber.datetime}})
              .then(update => {
                resolve('success')
              })
              .catch(err => {
                reject(err)
              })
          }))
        })
        Promise.all(requests)
          .then((responses) => res.status(200).json({status: 'success', payload: responses}))
          .catch((err) => res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`}))
      } else {
        res.status(200).json({status: 'success', payload: 'No Subscriber remaining for normalize'})
      }
    }).catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${err}`})
    })
}
exports.normalizeSubscribersDatetimeNull = function (req, res) {
  logger.serverLog(TAG, 'Hit the scripts normalizeDatetime')
  SubscribersModel.aggregate([
    {$match: {datetime: null}},
    {$group: {_id: '$pageId', count: {$sum: 1}}}
  ]).exec()
    .then(distintPages => {
      if (distintPages.length > 0) {
        distintPages.forEach(page => {
          SubscribersModel.find({pageId: page._id, datetime: null}).exec()
            .then(subscribers => {
              if (subscribers.length > 0) {
                let count = 0
                SubscribersModel.findOne({_id: {$lt: subscribers[0]._id}}).sort({_id: -1}).exec()
                  .then(startSub => {
                    if (startSub) {
                      const startDate = startSub.datetime
                      SubscribersModel.findOne({_id: {$gt: subscribers[subscribers.length - 1]._id}}).sort({_id: 1}).exec()
                        .then(endSub => {
                          if (endSub) {
                            const endDate = endSub.datetime
                            subscribers.forEach((sub, index) => {
                              let rDate = randomDate(new Date(startDate), new Date(endDate))
                              SubscribersModel.update({_id: sub._id}, {datetime: new Date(rDate)}).exec()
                                .then(updated => {
                                  count++
                                  if (index === (subscribers.length - 1)) {
                                    return res.status(200).json({ status: 'success', payload: `${count} records have been normalized successfully!` })
                                  }
                                })
                                .catch(err => {
                                  return res.status(500).json({status: 'failed', payload: `Failed to update subscriber ${err}`})
                                })
                            })
                          }
                        })
                        .catch(err => {
                          return res.status(500).json({status: 'failed', payload: `Failed to fetch end subscriber ${err}`})
                        })
                    }
                  })
                  .catch(err => {
                    return res.status(500).json({status: 'failed', payload: `Failed to fetch start subscriber ${err}`})
                  })
              }
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${err}`})
            })
        })
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch distint pages ${err}`})
    })
}

exports.addFullName = function (req, res) {
  logger.serverLog(TAG, 'Hit the scripts addFullName')
  SubscribersDataLayer.findSubscriberObjects({})
    .then(subscribers => {
      let requests = []
      if (subscribers.length > 0) {
        subscribers.forEach((subscriber, index) => {
          requests.push(new Promise((resolve, reject) => {
            SubscribersDataLayer.updateSubscriberObject(subscriber._id, {fullName: `${subscriber.firstName} ${subscriber.lastName}`})
              .then(update => {
                resolve({_id: subscriber._id, fullName: `${subscriber.firstName} ${subscriber.lastName}`})
              })
              .catch(err => {
                reject(err)
              })
          }))
        })
      }
      Promise.all(requests)
        .then((responses) => res.status(200).json({status: 'success', payload: responses}))
        .catch((err) => res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`}))
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${err}`})
    })
}

function updateSubscriber (session, callback) {
  SubscribersModel.update({_id: session.subscriber_id}, {status: session.status, last_activity_time: session.last_activity_time}).exec()
    .then(result => {
      callback()
    })
    .catch(err => {
      callback(err)
    })
}

exports.putSessionDetails = function (req, res) {
  callApi('sessions/', 'get', {}, '', 'kibochat').then(sessions => {
    async.each(sessions, updateSubscriber, function (err) {
      if (err) {
        res.status(500).json({status: 'failed', payload: err})
      } else {
        res.status(200).json({status: 'success', payload: 'updated successfully'})
      }
    })
  })
}

function updateCards (cards) {
  return new Promise(function (resolve, reject) {
    let id = ''
    cards.forEach((card, index) => {
      if (card.fileurl && card.fileurl.url) {
        id = card.fileurl.url.substring(card.fileurl.url.indexOf('download/') + 9)
        if (config.env === 'staging') {
          card.fileurl.url = `https://saccounts.cloudkibo.com/api/v1/files/download/${id}`
        } else {
          card.fileurl.url = `https://accounts.cloudkibo.com/api/v1/files/download/${id}`
        }
      }
      if (card.image_url) {
        id = card.image_url.substring(card.image_url.indexOf('download/') + 9)
        if (config.env === 'staging') {
          card.image_url = `https://saccounts.cloudkibo.com/api/v1/files/download/${id}`
        } else {
          card.image_url = `https://accounts.cloudkibo.com/api/v1/files/download/${id}`
        }
      }
      if (index === cards.length - 1) {
        resolve(cards)
      }
    })
  })
}

function updatePayload (payloads) {
  return new Promise(function (resolve, reject) {
    let id = ''
    payloads.forEach((payload, index) => {
      if (payload.componentType === 'gallery') {
        updateCards(payload.cards)
          .then(cards => {
          })
      } else if (payload.componentType === 'list') {
        updateCards(payload.listItems)
          .then(cards => {
          })
      } else {
        if (payload.fileurl && payload.fileurl.url) {
          id = payload.fileurl.url.substring(payload.fileurl.url.indexOf('download/') + 9)
          if (config.env === 'staging') {
            payload.fileurl.url = `https://saccounts.cloudkibo.com/api/v1/files/download/${id}`
          } else {
            payload.fileurl.url = `https://accounts.cloudkibo.com/api/v1/files/download/${id}`
          }
        }
        if (payload.image_url) {
          id = payload.image_url.substring(payload.image_url.indexOf('download/') + 9)
          if (config.env === 'staging') {
            payload.image_url = `https://saccounts.cloudkibo.com/api/v1/files/download/${id}`
          } else {
            payload.image_url = `https://accounts.cloudkibo.com/api/v1/files/download/${id}`
          }
        }
      }
      if (index === payloads.length - 1) {
        resolve(payloads)
      }
    })
  })
}

exports.normalizePageUrls = function (req, res) {
  PagesModel.find({})
    .then(pages => {
      pages.forEach((page, index) => {
        updatePayload(page.welcomeMessage)
          .then(payload => {
            PagesModel.updateOne({_id: page._id}, {welcomeMessage: payload}).then(updated => {
            })
          })
        if (index === pages.length - 1) {
          return res.status(200).json({status: 'success', payload: 'updated successfully'})
        }
      })
    })
}

exports.normalizeCommentUrls = function (req, res) {
  PostsModel.find({})
    .then(posts => {
      posts.forEach((post, index) => {
        updatePaylodForComments(post.payload)
          .then(payload => {
            PostsModel.updateOne({_id: post._id}, {payload: payload}).then(updated => {
            })
          })
        if (index === posts.length - 1) {
          return res.status(200).json({status: 'success', payload: 'updated successfully'})
        }
      })
    })
}
function updatePaylodForComments (payloads) {
  return new Promise(function (resolve, reject) {
    let id = ''
    payloads.forEach((payload, index) => {
      if (payload.url) {
        id = payload.url.substring(payload.url.indexOf('download/') + 9)
        if (config.env === 'staging') {
          payload.url = `https://saccounts.cloudkibo.com/api/v1/files/download/${id}`
        } else {
          payload.url = `https://accounts.cloudkibo.com/api/v1/files/download/${id}`
        }
      }
      if (index === payloads.length - 1) {
        resolve(payloads)
      }
    })
  })
}
exports.normalizeReferralUrls = function (req, res) {
  ReferralModel.find({})
    .then(referrals => {
      referrals.forEach((referral, index) => {
        updatePayload(referral.reply)
          .then(payload => {
            ReferralModel.updateOne({_id: referral._id}, {reply: payload}).then(updated => {
            })
          })
        if (index === referrals.length - 1) {
          return res.status(200).json({status: 'success', payload: 'updated successfully'})
        }
      })
    })
}
exports.normalizePersistentMenu = function (req, res) {
  MenuModel.find({})
    .then(menus => {
      menus.forEach((menu, index) => {
        updatePaylodForMenu(menu.jsonStructure)
          .then(jsonStructure => {
            MenuModel.updateOne({_id: menu._id}, {jsonStructure: jsonStructure}).then(updated => {
            })
          })
        if (index === menus.length - 1) {
          return res.status(200).json({status: 'success', payload: 'updated successfully'})
        }
      })
    })
}
function updatePaylodForMenu (jsonStructures) {
  return new Promise(function (resolve, reject) {
    jsonStructures.forEach((jsonStructure, index) => {
      if (jsonStructure.payload) {
        updatePayload(JSON.parse(jsonStructure.payload))
          .then(payload => {
            jsonStructure.payload = JSON.stringify(payload)
          })
      } else if (jsonStructure.submenu && jsonStructure.submenu.length > 0) {
        loopOnSubMenu(jsonStructure.submenu)
          .then(submenu => {
            jsonStructure.submenu = submenu
          })
      }
      if (index === jsonStructures.length - 1) {
        resolve(jsonStructures)
      }
    })
  })
}

function loopOnSubMenu (submenus) {
  return new Promise(function (resolve, reject) {
    submenus.forEach((submenu, index) => {
      if (submenu.payload) {
        updatePayload(JSON.parse(submenu.payload))
          .then(payload => {
            submenu.payload = JSON.stringify(payload)
          })
      }
      if (submenu.submenu && submenu.submenu.length > 0) {
        loopOnSubMenu(submenu.submenu)
          .then(submenu => {
            submenu.submenu = submenu
          })
      }
      if (index === submenus.length - 1) {
        resolve(submenus)
      }
    })
  })
}

exports.normalizeForFbDisconnect = function (req, res) {
  UserModel.find().exec()
    .then(users => {
      async.each(users, updateUser, function (err) {
        if (err) {
          res.status(500).json({status: 'failed', payload: err})
        } else {
          res.status(200).json({status: 'success', payload: 'updated successfully'})
        }
      })
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

function updateUser (user, callback) {
  if (user.facebookInfo) {
    UserModel.update({_id: user._id}, {connectFacebook: true, showIntegrations: true}).exec()
      .then(updated => {
        callback()
      })
      .catch(err => {
        callback(err)
      })
  } else {
    callback()
  }
}
exports.normalizeForPlatform = function (req, res) {
  UserModel.find().exec()
    .then(users => {
      async.each(users, updatePlatform, function (err) {
        if (err) {
          res.status(500).json({status: 'failed', payload: err})
        } else {
          res.status(200).json({status: 'success', payload: 'updated successfully'})
        }
      })
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
function updatePlatform (user, callback) {
  UserModel.update({_id: user._id}, {platform: 'messenger'}).exec()
    .then(updated => {
      callback()
    })
    .catch(err => {
      callback(err)
    })
}

function setPagesField_isApproved_InInterval (pages, delay, res) {
  let i = -1
  let errorMessage = `permission must be granted`
  let count = 0
  let interval = setInterval(() => {
    i++
    if (i === pages.length) {
      clearInterval(interval)
      console.log('sending response')
      res.status(200).json({status: 'success', payload: count})
    } else {
      if (pages[i].accessToken) {
        needle('get', `https://graph.facebook.com/v6.0/me?access_token=${pages[i].accessToken}`)
          .then(response => {
            if (response.body && response.body.error && response.body.error.message.includes(errorMessage)) {
              count++
              PagesModel.update({_id: pages[i]._id}, {isApproved: false}).exec().then(updated => {
              })
            }
          })
          .catch(err => {
            console.log('pages[i].accessToken', pages[i].accessToken)
            return res.status(500).json({status: 'failed', payload: `Failed to fetch permission ${err}`})
          })
      }
    }
  }, delay)
}
function intervalForEach (array, delay, res) {
  let current = 0
  let data = []
  let count = 0

  let interval = setInterval(() => {
    if (current === array.length) {
      clearInterval(interval)
      return res.status(200).json({status: 'success', payload: data, count})
    } else {
      if (array[current].userId && array[current].userId.facebookInfo) {
        needle('get', `https://graph.facebook.com/v6.0/${array[current].pageId}?fields=access_token&access_token=${array[current].userId.facebookInfo.fbToken}`)
          .then(resp => {
            if (!resp.body.error && !resp.body.access_token) {
              count++
              data.push(array[current]._id)
              current++
            } else {
              current++
            }
          })
          .catch(err => {
            return res.status(500).json({status: 'failed', payload: `Failed to fetch accesstoken ${err}`})
          })
      } else {
        current++
      }
    }
  }, delay)
}

exports.analyzePages = function (req, res) {
  PagesModel.aggregate([
    {$lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'userId'}},
    {$unwind: '$userId'},
    {$limit: req.body.limit},
    {$skip: req.body.skip}
  ]).exec()
    .then(pages => {
      intervalForEach(pages, 500, res)
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch pages ${err}`})
    })
}
exports.deleteUnapprovedPages = function (req, res) {
  PagesModel.aggregate([
    {$match: {isApproved: true}},
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(pages => {
      setPagesField_isApproved_InInterval(pages, 500, res)
      // for (let i = 0; i < pages.length; i++) {
      //   needle('get', `https://graph.facebook.com/v6.0/me?access_token=${pages[i].accessToken}`)
      //     .then(response => {
      //       if (response.body && response.body.error && response.body.error.message.includes(errorMessage)) {
      //         PagesModel.update({_id: pages[i]._id}, {isApproved: false}).exec().then(updated => {
      //         })
      //       }
      //     })
      // }
      // res.status(200).json({status: 'success', payload: 'updated successfully'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch pages ${err}`})
    })
}
exports.normalizeUnreadCount = function (req, res) {
  let query = {
    purpose: 'aggregate',
    match: {status: 'unseen', format: 'facebook'},
    group: {_id: '$subscriber_id', count: {$sum: 1}}
  }
  callApi(`livechat/queryForScript`, 'post', query, undefined, 'kibochat')
    .then(data => {
      updateUnreadCount(data)
        .then(data => {
          return res.status(200).json({status: 'success', payload: 'updated successfully'})
        })
        .catch((err) => {
          res.status(500).json({status: 'failed', payload: `Failed to update counts ${err}`})
        })
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: `Failed to fetch unread counts ${err}`})
    })
}
function updateUnreadCount (data) {
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < data.length; i++) {
      SubscribersModel.update({_id: data[i]._id}, {unreadCount: data[i].count}).exec()
        .then(updated => {
          if (i === data.length - 1) {
            resolve()
          }
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}
exports.normalizeMessagesCount = function (req, res) {
  let query = {
    purpose: 'aggregate',
    match: {},
    group: {_id: '$subscriber_id', count: {$sum: 1}}
  }
  callApi(`livechat/queryForScript`, 'post', query, undefined, 'kibochat')
    .then(data => {
      updateMessagesCount(data)
        .then(data => {
          return res.status(200).json({status: 'success', payload: 'updated successfully'})
        })
        .catch((err) => {
          res.status(500).json({status: 'failed', payload: `Failed to update counts ${err}`})
        })
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: `Failed to fetch unread counts ${err}`})
    })
}
function updateMessagesCount (data) {
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < data.length; i++) {
      SubscribersModel.update({_id: data[i]._id}, {messagesCount: data[i].count}).exec()
        .then(updated => {
          if (i === data.length - 1) {
            resolve()
          }
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}

exports.normalizeLastMessagedAt = function (req, res) {
  let subscribersQuery = [
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]
  SubscribersModel.aggregate(subscribersQuery).exec()
    .then(subscribers => {
      subscribers.forEach((subscriber) => {
        let query = {
          purpose: 'aggregate',
          match: {format: 'facebook', subscriber_id: subscriber._id},
          group: {_id: null, chat: {$last: '$$ROOT'}}
        }
        callApi(`livechat/queryForScript`, 'post', query, undefined, 'kibochat')
          .then(data => {
            let lastMessagedAt = subscriber.datetime
            if (data.length > 0) {
              lastMessagedAt = data[0].chat.datetime
            }
            SubscribersModel.update({_id: subscriber._id}, {lastMessagedAt}).exec()
              .then(updated => {
                logger.serverLog(TAG, `updated successfully for ${subscriber._id}`)
              })
              .catch(err => {
                logger.serverLog(TAG, err)
              })
          })
          .catch(err => {
            logger.serverLog(TAG, err)
          })
      })
      return res.status(200).json({status: 'success'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}
exports.normalizeCommentCapture = function (req, res) {
  let updatePayload
  PostsModel.find({})
    .then(posts => {
      for (let i = 0; i < posts.length; i++) {
        updatePayload = [{
          componentType: 'text',
          text: posts[i].reply
        }]
        PostsModel.updateOne({_id: posts[i]._id}, {reply: updatePayload}).then(updated => {
        })
        if (i === posts.length - 1) {
          return res.status(200).json({status: 'success'})
        }
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.normalizePagePermissions = function (req, res) {
  PagesModel.find({gotPageSubscriptionPermission: true})
    .then(pages => {
      let requests1 = []
      let requests2 = []
      pages.forEach((page, index) => {
        if (page.accessToken) {
          requests1.push(
            needle('get', `https://graph.facebook.com/v6.0/me/messaging_feature_review?access_token=${page.accessToken}`)
              .then(response => {
                if (response.body.error) {
                  logger.serverLog(TAG, `Failed to check subscription_messaging permission status ${response.body.error}`, 'error')
                  requests2.push(PagesModel.updateOne({_id: page._id}, {gotPageSubscriptionPermission: false}))
                } else {
                  let data = response.body.data
                  let smp = data.filter((d) => d.feature === 'subscription_messaging')
                  logger.serverLog(TAG, `Updating gotPageSubscriptionPermission for page ${page._id} ${JSON.stringify(data)}`)
                  if (smp.length > 0 && smp[0].status.toLowerCase() === 'approved') {
                    requests2.push(PagesModel.updateOne({_id: page._id}, {gotPageSubscriptionPermission: true}))
                  } else {
                    requests2.push(PagesModel.updateOne({_id: page._id}, {gotPageSubscriptionPermission: false}))
                  }
                }
              })
              .catch(err => {
                logger.serverLog(TAG, `Failed to check subscription_messaging permission status ${err}`, 'error')
              })
          )
        } else {
          requests2.push(PagesModel.updateOne({_id: page._id}, {gotPageSubscriptionPermission: false}))
        }
      })
      Promise.all(requests1)
        .then(() => {
          Promise.all(requests2)
            .then(results => {
              return res.status(200).json({status: 'success', payload: `Updated ${results.length} records`})
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to update page ${err}`})
            })
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: `Failed to check subscription_messaging permission status ${err}`})
        })
    })
}
exports.normalizeCompanyProfiles = function (req, res) {
  CompanyProfilesModel.find({}).then(companyProfiles => {
    async.each(companyProfiles, updateCompanyProfile, function (err) {
      if (err) {
        res.status(500).json({status: 'failed', payload: err})
      } else {
        res.status(200).json({status: 'success', payload: 'updated successfully'})
      }
    })
  })
}
function updateCompanyProfile (companyProfileData, callback) {
  let companyProfile = JSON.parse(JSON.stringify(companyProfileData))
  let data = {}
  if (companyProfile.flockSendWhatsApp) {
    data = {
      provider: 'flockSend',
      accessToken: companyProfile.flockSendWhatsApp.accessToken,
      businessNumber: companyProfile.flockSendWhatsApp.number
    }
  } else if (companyProfile.twilioWhatsApp) {
    data = {
      provider: 'twilio',
      accessToken: companyProfile.twilioWhatsApp.authToken,
      businessNumber: companyProfile.twilioWhatsApp.sandboxNumber,
      sandboxCode: companyProfile.twilioWhatsApp.sandboxCode,
      accountSID: companyProfile.twilioWhatsApp.accountSID
    }
  }
  if (data.provider) {
    CompanyProfilesModel.update(
      {_id: companyProfile._id},
      { $unset: {flockSendWhatsApp: '', twilioWhatsApp: ''},
        $set: {whatsApp: data} },
      {strict: false}
    ).exec()
      .then(result => {
        callback()
      })
      .catch(err => {
        callback(err)
      })
  } else {
    callback()
  }
}


exports.normalizeWhatspContact = function (req, res) {
  CompanyProfilesModel.find({whatsApp: { $exists: true }}).then(companyProfiles => {
    console.log('companyProfiles', companyProfiles.length)
    let distinctNumber = []
    let requests = []
    let updated = {$unset: {whatsApp: 1}}
    companyProfiles.forEach((companyProfile, index) => {
      if (distinctNumber.includes(companyProfile.whatsApp.businessNumber) && companyProfile._id != '5a89ecdaf6b0460c552bf7fe') {
        let query = {
          purpose: 'deleteMany',
          match: {companyId: companyProfile._id}
        }
        requests.push(CompanyProfilesModel.update({_id: companyProfile._id}, updated, {}).exec())
        requests.push(ContactModel.deleteMany({companyId: companyProfile._id}))
        requests.push(callApi(`whatsAppBroadcasts`, 'delete', query, '', 'kiboengage'))
        requests.push(callApi(`whatsAppChat`, 'delete', query, '', 'kibochat'))
        requests.push(new Promise((resolve, reject) => {
          CompanyUsers.find({companyId: companyProfile._id}).then(companyUsers => {
            let userIds = companyUsers.map(companyUser => companyUser.userId)
            UserModel.update({_id: {$in: userIds}}, { $set: {platform: 'messenger'} }, {})
              .exec().then(updatedPlatform => {
                resolve('success')
              })
          })
        }))
      } else {
        distinctNumber.push(companyProfile.whatsApp.businessNumber)
      }
    })
    console.log('requests.length', requests.length)
    Promise.all(requests)
      .then((responses) => res.status(200).json({status: 'success', payload: 'Data normalized suceess'}))
      .catch((err) => {
        console.log('error', err)
        res.status(500).json({status: 'failed', description: `Error: ${JSON.stringify(err)}`})
      })
  })
}

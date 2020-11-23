const logger = require('../../../components/logger')
const dataLayer = require('./pages.datalayer')
const logicLayer = require('./pages.logiclayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const UserDataLayer = require('./../user/user.datalayer')
const TAG = '/api/v1/pages/pages.controller.js'
const needle = require('needle')
const { callApi } = require('../../scripts/apiCaller')
const util = require('util')
const async = require('async')
const _ = require('lodash')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  dataLayer.findOnePageObject(req.params._id)
    .then(pageObject => {
      sendSuccessResponse(res, 200, pageObject)
    })
    .catch(err => {
      const message = err || 'Failed to Fetch Page '
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.refreshPages = function (req, res) {
  if (req.user.role === 'buyer') {
    if (req.user.facebookInfo) {
      fetchPages(`https://graph.facebook.com/v6.0/${
        req.user.facebookInfo.fbId}/accounts?access_token=${
        req.user.facebookInfo.fbToken}`, req.user, res)
    } else {
    }
  } else {
    CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({companyId: req.user.companyId, role: 'buyer'})
      .then(companyUser => {
        UserDataLayer.findOneUserObject(companyUser.userId)
          .then(owner => {
            if (owner.facebookInfo) {
              fetchPages(`https://graph.facebook.com/v6.0/${
                owner.facebookInfo.fbId}/accounts?access_token=${
                owner.facebookInfo.fbToken}`, owner, res)
            } else {
              logger.serverLog('Owner Facebook Info not found', `${TAG}: exports.refreshPages`)
            }
          })
          .catch(err => {
            const message = err || 'Unable to fetch owner details of the company'
            logger.serverLog(message, `${TAG}: exports.refreshPages`, req.body, {user: req.user}, 'error')
            sendErrorResponse(res, 500, `Unable to fetch owner details of the company. ${err}`)
          })
      })
      .catch(err => {
        const message = err || 'Unable to fetch company of the user'
        logger.serverLog(message, `${TAG}: exports.refreshPages`, req.body, {user: req.user}, 'error')
        sendErrorResponse(res, 500, `Unable to fetch company of the user. ${err}`)
      })
  }
}

exports.create = function (req, res) {
  dataLayer.createPageObject(
    req.body.pageId, req.body.pageName, req.body.pageUserName, req.body.pagePic, req.body.likes, req.body.accessToken,
    req.body.connected, req.body.userId, req.body.companyId, req.body.greetingText, req.body.welcomeMessage, req.body.isWelcomeMessageEnabled,
    req.body.gotPageSubscriptionPermission
  )
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Unable to create Page'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  dataLayer.updatePageObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Unable to Update Page'
      logger.serverLog(message, `${TAG}: exports.Update`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  dataLayer.deletePageObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Unable to delete Page'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.connect = function (req, res) {
  dataLayer.findOnePageObject(req.params._id)
    .then(page => {
      // create default tags
      callApi('tags/query', 'post', { purpose: 'findAll', match: { defaultTag: true, pageId: req.params._id, companyId: req.user.companyId } }, '', 'kiboengage')
        .then(defaultTags => {
          defaultTags = defaultTags.map((t) => t.tag)
          if (!defaultTags.includes(`_${page.pageId}_1`)) {
            createTag(req.user, page, `_${page.pageId}_1`)
          }
          if (!defaultTags.includes('male')) {
            createTag(req.user, page, 'male')
          }
          if (!defaultTags.includes('female')) {
            createTag(req.user, page, 'female')
          }
          if (!defaultTags.includes('other')) {
            createTag(req.user, page, 'other')
          }
        })
        .catch(err => {
          const message = err || 'Error at find default tags'
          logger.serverLog(message, `${TAG}: exports.connect`, req.body, {user: req.user}, 'error')
        })
      // initiate reach estimation
      needle('post', `https://graph.facebook.com/v6.0/me/broadcast_reach_estimations?access_token=${page.pageAccessToken}`)
        .then(reachEstimation => {
          if (reachEstimation.reach_estimation_id) {
            dataLayer.updatePageObject(req.params._id, { connected: true, reachEstimationId: reachEstimation.reach_estimation_id })
              .then(result => {
                sendSuccessResponse(res, 200, result)
              })
              .catch(err => {
                const message = err || 'Unable to update Page'
                logger.serverLog(message, `${TAG}: exports.connect`, req.body, {user: req.user}, 'error')
                sendErrorResponse(res, 500, err)
              })
          } else {
            logger.serverLog(`Failed to start reach estimation`, `${TAG}: exports.connect`)
          }
        })
        .catch(err => {
          const message = `Error at find page from Facebook ${util.inspect(err)}`
          logger.serverLog(message, `${TAG}: exports.connect`, req.body, {user: req.user}, 'error')
        })
    })
    .catch(err => {
      const message = err || 'Unable to Connect Page'
      logger.serverLog(message, `${TAG}: exports.connect`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.disconnect = function (req, res) {
  dataLayer.updatePageObject(req.params._id, {connected: false})
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Error at update page'
      logger.serverLog(message, `${TAG}: exports.disconnect`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.getGreetingText = function (req, res) {
  dataLayer.findOnePageObject(req.params._id)
    .then(pageObject => {
      sendSuccessResponse(res, 200, pageObject.greetingText)
    })
    .catch(err => {
      const message = err || 'Failed to find Page '
      logger.serverLog(message, `${TAG}: exports.getGreetingText`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.setGreetingText = function (req, res) {
  CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      let query = { pageId: req.params._id, companyId: companyUser.companyId }
      let updated = req.body
      return dataLayer.updatePageObjectUsingQuery(query, updated, { multi: true })
    })
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to updated greetingText '
      logger.serverLog(message, `${TAG}: exports.setGreetingText`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  dataLayer.findPageObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to querying page '
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  let query = logicLayer.validateAndConvert(req.body)

  dataLayer.aggregateInfo(query)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate page '
      logger.serverLog(message, `${TAG}: exports.aggregate`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdatePageObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({ status: 'success', payload: result })
    })
    .catch(err => {
      const message = err || 'Failed to Update page '
      logger.serverLog(message, `${TAG}: exports.genericUpdate`, req.body, {user: req.user}, 'error')
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.fetchWhitelistedDomains = function (req, res) {
  let facebookInfo = req.user.facebookInfo
  if (req.user.role !== 'buyer') {
    facebookInfo = req.user.buyerInfo.facebookInfo
  }
  needle.get(`https://graph.facebook.com/v6.0/${req.params._id}?fields=access_token&access_token=${facebookInfo.fbToken}`,
    (err, resp) => {
      if (err) {
        const message = `Error in getting accessToken ${JSON.stringify(err)}`
        logger.serverLog(message, `${TAG}: exports.fetchWhitelistedDomains`, req.body, {user: req.user}, 'error')
        sendErrorResponse(res, 500, '', 'Error in getting accessToken')
      }
      var accessToken = resp.body.access_token
      needle.get(`https://graph.facebook.com/v6.0/me/messenger_profile?fields=whitelisted_domains&access_token=${accessToken}`, function (err, resp) {
        if (err) {
          const message = `Error in getting whitelisted_domains ${JSON.stringify(err)}`
          logger.serverLog(message, `${TAG}: exports.fetchWhitelistedDomains`, req.body, {user: req.user}, 'error')
          sendErrorResponse(res, 500, '', 'Error in getting whitelisted_domains')
        }
        var whitelistDomains = []
        var body = JSON.parse(JSON.stringify(resp.body))
        if (body.data && body.data.length > 0 && body.data[0].whitelisted_domains) {
          whitelistDomains = body.data[0].whitelisted_domains
        }
        return sendSuccessResponse(res, 200, whitelistDomains)
      })
    })
}

exports.whitelistDomain = function (req, res) {
  dataLayer.findOnePageObjectUsingQuery({ pageId: req.body.page_id, companyId: req.user.companyId })
    .then(page => {
      var accessToken = page.accessToken
      let requesturl = `https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${accessToken}`
      if (req.body.whitelistDomains.length < 1) {
        needle.request('delete', requesturl, {'fields': ['whitelisted_domains']}, {json: true}, function (err, resp) {
          if (err) {
            const message = `Error in delete whitelisted_domains ${JSON.stringify(err)}`
            logger.serverLog(message, `${TAG}: exports.fetchWhitelistedDomains`, req.body, {user: req.user}, 'error')  
          }
          var response = JSON.parse(JSON.stringify(resp.body))
          if (response.result === 'success') {
            sendSuccessResponse(res, 200, req.body)
          } else {
            if (response.error && response.error.message) {
              logger.serverLog(response.error.message, `${TAG}: exports.whitelistDomain`, req.body, {user: req.user}, 'error')      
              sendErrorResponse(res, 500, response.error.message)
            } else {
              logger.serverLog(response.error, `${TAG}: exports.whitelistDomain`, req.body, {user: req.user}, 'error')      
              sendErrorResponse(res, 500, response)
            }
          }
        })
      } else {
        needle.request('post', requesturl, {whitelisted_domains: req.body.whitelistDomains && req.body.whitelistDomains.length > 0 ? req.body.whitelistDomains : []}, {json: true}, function (err, resp) {
          if (err) {
            const message = err || `Failed to fetch whitelist domain`
            logger.serverLog(message, `${TAG}: exports.whitelistDomain`, req.body, {user: req.user}, 'error')
          }
          var response = JSON.parse(JSON.stringify(resp.body))
          if (response.result === 'success') {
            sendSuccessResponse(res, 200, req.body)
          } else {
            if (response.error && response.error.message) {
              logger.serverLog(response.error.message, `${TAG}: exports.whitelistDomain`, req.body, {user: req.user}, 'error')      
              sendErrorResponse(res, 500, response.error.message)
            } else {
              logger.serverLog(response.error, `${TAG}: exports.whitelistDomain`, req.body, {user: req.user}, 'error')
              sendErrorResponse(res, 500, response)
            }
          }
        })
      }
    }).catch(err => {
      const message = err || `Failed to fetch page`
      logger.serverLog(message, `${TAG}: exports.whitelistDomain`, req.body, {user: req.user}, 'error')
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.deleteWhitelistDomain = function (req, res) {
  dataLayer.findOnePageObjectUsingQuery({ pageId: req.body.page_id, companyId: req.user.companyId })
    .then(page => {
      var accessToken = page.accessToken
      needle.get(`https://graph.facebook.com/v6.0/me/messenger_profile?fields=whitelisted_domains&access_token=${accessToken}`, function (err, resp) {
        if (err) {
          logger.serverLog(err, `${TAG}: exports.deleteWhitelistDomain`, req.body, {user: req.user}, 'error')      
        }
        var body = JSON.parse(JSON.stringify(resp.body))
        let temp = []
        if (body.data && body.data.length > 0 && body.data[0].whitelisted_domains) {
          let whitelistDomains = body.data[0].whitelisted_domains
          for (let i = 0; i < whitelistDomains.length; i++) {
            if (whitelistDomains[i] !== req.body.whitelistDomain) {
              temp.push(whitelistDomains[i])
            }
          }
          if (temp.length > 0 && temp.length === whitelistDomains.length) {
            return res.status(500).json({ status: 'failed', description: 'Domain not found' })
          }
          let whitelistedDomains = {
            whitelisted_domains: temp
          }
          if (temp.length < 1) {
            let requesturl = `https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${accessToken}`
            needle.request('delete', requesturl, { 'fields': ['whitelisted_domains'] }, { json: true }, function (err, resp) {
              if (err) {
                const message = err || `Error in delete whitelisted_domains`
                logger.serverLog(message, `${TAG}: exports.deleteWhitelistDomain`, req.body, {user: req.user}, 'error')
              }
              var response = JSON.parse(JSON.stringify(resp.body))
              if (response.result === 'success') {
                sendSuccessResponse(res, 200, temp)
              } else {
                sendErrorResponse(res, 500, '', `Unable to delete whitelist domain ${response}`)
              }
            })
          } else {
            let requesturl = `https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${accessToken}`
            needle.request('post', requesturl, whitelistedDomains, { json: true }, function (err, resp) {
              if (err) {
                const message = err || `Error in save whitelisted_domains`
                logger.serverLog(message, `${TAG}: exports.deleteWhitelistDomain`, req.body, {user: req.user}, 'error')
              }
              if (resp.body.result === 'success') {
                sendSuccessResponse(res, 200, temp)
              }
            })
          }
        } else {
          sendSuccessResponse(res, 200, temp)
        }
      })
    }).catch(err => {
      const message = err || `Failed to fetch page`
      logger.serverLog(message, `${TAG}: exports.deleteWhitelistDomain`, req.body, {user: req.user}, 'error')
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.updatePageNames = function (req, res) {
  dataLayer.findPageObjects({pageName: null})
    .then(userPages => {
      if (userPages.length < 1) {
        sendSuccessResponse(res, 200, {}, 'There are no records with null Page Names')
      }
      userPages.forEach((page, index) => {
        logger.serverLog(
          `Page#${index} user access token - ${page.userId.facebookInfo.fbToken}`, TAG)
        needle.get(
          `https://graph.facebook.com/v6.0/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
          (err, resp) => {
            if (err) {
              const message = err || `Failed to fetch access page token`
              logger.serverLog(message, `${TAG}: exports.updatePageNames`, req.body, {user: req.user}, 'error')
            }
            if (resp.body.error) {
              const message = resp.body.error || `Failed to fetch access page token`
              logger.serverLog(message, `${TAG}: exports.updatePageNames`, req.body, {user: req.user}, 'error')
            }
            if (resp && resp.body && resp.body.access_token) {
              logger.serverLog(
                `Page#${index} current Access Token ${JSON.stringify(
                  resp.body.access_token)}`, TAG)
              needle.get(
                `https://graph.facebook.com/v6.0/${page.pageId}?fields=name&access_token=${resp.body.access_token}`,
                (err, pageResponse) => {
                  if (err) {
                    const message = err || `Failed to fetch pageName grom GraphApi`
                    logger.serverLog(message, `${TAG}: exports.updatePageNames`, req.body, {user: req.user}, 'error')
                  }
                  if (pageResponse.body.error) {
                    const message = err || `Failed to fetch pageName grom GraphApi`
                    logger.serverLog(message, `${TAG}: exports.updatePageNames`, req.body, {user: req.user}, 'error')
                  }
                  if (pageResponse && pageResponse.body && pageResponse.body.name) {
                    logger.serverLog(
                      `Page#${index} page name from Graph API - ${pageResponse.body.name}`, TAG)
                    dataLayer.updatePageObject(page._id, { pageName: pageResponse.body.name })
                      .then(result => {
                        logger.serverLog(
                          `Page#${index} - Page Name:${pageResponse.body.name} saved in Database`, TAG)
                      })
                      .catch(err => {
                        const message = err || `Failed to Save page`
                        logger.serverLog(message, `${TAG}: exports.updatePageNames`, req.body, {user: req.user}, 'error')                  
                      })
                  }
                })
            }
            if (index === (userPages.length - 1)) {
              sendSuccessResponse(res, 200, {}, 'Successfully Executed')
            }
          })
      })
    })
    .catch(err => {
      const message = err || `Failed to find page`
      logger.serverLog(message, `${TAG}: exports.updatePageNames`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

function createTag (user, page, tag) {
  needle('post', `https://graph.facebook.com/v6.0/me/custom_labels?accessToken=${page.pageAccessToken}`)
    .then(label => {
      if (label.id) {
        let tagData = {
          tag: tag,
          userId: user._id,
          companyId: user.companyId,
          pageId: page._id,
          labelFbId: label.id
        }
        callApi('tags', 'post', tagData, '', 'kiboengage')
          .then(created => {
          })
          .catch(err => {
            const message = err || `Failed to save Tag`
            logger.serverLog(message, `${TAG}: exports.createTag`, page, {user: user}, 'error')                        
          })
      } else {
        const message = `Error at create tag on Facebook ${util.inspect(label.error)}`
        logger.serverLog(message, `${TAG}: exports.createTag`, page, {user: user}, 'error')
      }
    })
    .catch(err => {
      const message = err || 'Failed to create tag on Facebook'
      logger.serverLog(message, `${TAG}: exports.createTag`, page, {user: user}, 'error')
    })
}

function fetchPages (url, user, res) {
  const options = {
    headers: {
      'X-Custom-Header': 'CloudKibo Web Application'
    },
    json: true
  }
  needle.get(url, options, (err, resp) => {
    if (err !== null) {
      const message = err || `Failed to fetch page`
      logger.serverLog(message, `${TAG}: exports.refreshPages`, url, {user: user}, 'error')
      return
    }
    const data = resp.body.data
    const cursor = resp.body.paging
    if (data) {
      async.each(data, updatePages.bind(null, user), function (err) {
        if (err) {
          const message = err || `Failed to update pages`
          logger.serverLog(message, `${TAG}: exports.refreshPages`, url, {user: user}, 'error')    
          return res.status(500).json({ status: 'failed', payload: err })
        } else
        if (!cursor.next) {
          return res.status(200).json({ status: 'success', payload: 'success' })
        }
      })
    } else {
      return res.status(200).json({ status: 'success', payload: [] })
    }
    if (cursor && cursor.next) {
      fetchPages(cursor.next, user, res)
    } else {
      logger.serverLog('Undefined Cursor from graph API', TAG)
    }
  })
}
function updatePages (user, item, callback) {
  const options2 = {
    url: `https://graph.facebook.com/v6.0/${item.id}/?fields=fan_count,username&access_token=${item.access_token}`,
    qs: {access_token: item.access_token},
    method: 'GET'
  }
  needle.get(options2.url, options2, (error, fanCount) => {
    if (error !== null) {
      callback(error)
    } else {
      CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({domain_email: user.domain_email})
        .then(companyUser => {
          if (!companyUser) {
            logger.serverLog('The user account does not belong to any company. Please contact support', `${TAG}: exports.updatePages`)
          } else {
            dataLayer.findPageObjects({pageId: item.id, userId: user._id, companyId: companyUser.companyId})
              .then(pages => {
                let page = pages[0]
                if (!page) {
                  let payloadPage = {
                    pageId: item.id,
                    pageName: item.name,
                    accessToken: item.access_token,
                    userId: user._id,
                    companyId: companyUser.companyId,
                    likes: fanCount.body.fan_count,
                    pagePic: `https://graph.facebook.com/v6.0/${item.id}/picture`,
                    connected: false
                  }
                  if (fanCount.body.username) {
                    payloadPage = _.merge(payloadPage,
                      { pageUserName: fanCount.body.username })
                  }
                  dataLayer.savePageObject(payloadPage)
                    .then(page => {
                      callback()
                    })
                    .catch(err => {
                      callback(err)
                    })
                } else {
                  let updatedPayload = {
                    likes: fanCount.body.fan_count,
                    pagePic: `https://graph.facebook.com/v6.0/${item.id}/picture`,
                    accessToken: item.access_token
                  }
                  if (fanCount.body.username) {
                    updatedPayload['pageUserName'] = fanCount.body.username
                  }
                  dataLayer.updatePageObjectUsingQuery({ _id: page._id }, updatedPayload, {})
                    .then(updated => {
                      callback()
                    })
                    .catch(err => {
                      callback(err)
                    })
                }
              })
              .catch(err => {
                callback(err)
              })
          }
        })
        .catch(err => {
          callback(err)
        })
    }
  })
}

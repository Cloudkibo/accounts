const logger = require('../../../components/logger')
const dataLayer = require('./pages.datalayer')
const logicLayer = require('./pages.logiclayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const TAG = '/api/v1/pages/pages.controller.js'
const needle = require('needle')
const { callApi } = require('../../scripts/apiCaller')
const util = require('util')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find page controller index')

  dataLayer.findOnePageObject(req.params._id)
    .then(pageObject => {
      sendSuccessResponse(res, 200, pageObject)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create page controller index')
  dataLayer.createPageObject(
    req.body.pageId, req.body.pageName, req.body.pageUserName, req.body.pagePic, req.body.likes, req.body.accessToken,
    req.body.connected, req.body.userId, req.body.companyId, req.body.greetingText, req.body.welcomeMessage, req.body.isWelcomeMessageEnabled,
    req.body.gotPageSubscriptionPermission
  )
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update page controller index')

  dataLayer.updatePageObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update page ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete page controller index')

  dataLayer.deletePageObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete page ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.connect = function (req, res) {
  logger.serverLog(TAG, 'Hit the connecting page controller index')
  dataLayer.findOnePageObject(req.params._id)
    .then(page => {
      // create default tags
      callApi('tags/query', 'post', {purpose: 'findAll', match: {defaultTag: true, pageId: req.params._id, companyId: req.user.companyId}}, '', 'kiboengage')
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
          logger.serverLog(TAG, `Error at find default tags ${util.inspect(err)}`)
        })
      // initiate reach estimation
      needle('post', `https://graph.facebook.com/v6.0/me/broadcast_reach_estimations?access_token=${page.pageAccessToken}`)
        .then(reachEstimation => {
          if (reachEstimation.reach_estimation_id) {
            dataLayer.updatePageObject(req.params._id, {connected: true, reachEstimationId: reachEstimation.reach_estimation_id})
              .then(result => {
                sendSuccessResponse(res, 200, result)
              })
              .catch(err => {
                logger.serverLog(TAG, `Error at update page ${util.inspect(err)}`)
                sendErrorResponse(res, 500, err)
              })
          } else {
            logger.serverLog(TAG, `Failed to start reach estimation`)
          }
        })
        .catch(err => {
          logger.serverLog(TAG, `Error at find page ${util.inspect(err)}`)
        })
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at find page ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.disconnect = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete page controller index')

  dataLayer.updatePageObject(req.params._id, {connected: false})
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update page ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.getGreetingText = function (req, res) {
  dataLayer.findOnePageObject(req.params._id)
    .then(pageObject => {
      sendSuccessResponse(res, 200, pageObject.greetingText)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.setGreetingText = function (req, res) {
  logger.serverLog(TAG, 'Hit the setGreetingText page controller index')

  CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({domain_email: req.user.domain_email})
    .then(companyUser => {
      let query = {pageId: req.params._id, companyId: companyUser.companyId}
      let updated = req.body
      return dataLayer.updatePageObjectUsingQuery(query, updated, {multi: true})
    })
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at updated greetingText ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for page controller')

  dataLayer.findPageObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying page ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for page controller')
  let query = logicLayer.validateAndConvert(req.body)

  dataLayer.aggregateInfo(query)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate page ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.genericUpdate = function (req, res) {
  logger.serverLog(TAG, 'generic update endpoint')

  dataLayer.genericUpdatePageObject(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(TAG, `generic update endpoint ${util.inspect(err)}`)
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
        sendErrorResponse(res, 500, '', 'Error in getting accessToken')
      }
      var accessToken = resp.body.access_token
      needle.get(`https://graph.facebook.com/v6.0/me/messenger_profile?fields=whitelisted_domains&access_token=${accessToken}`, function (err, resp) {
        if (err) {
          sendErrorResponse(res, 500, '', 'Error in getting whitelisted_domains')
        }
        var whitelistDomains = []
        var body = JSON.parse(JSON.stringify(resp.body))
        if (body.data && body.data.length > 0 && body.data[0].whitelisted_domains) {
          whitelistDomains = body.data[0].whitelisted_domains
        }
        sendSuccessResponse(res, 200, whitelistDomains)
      })
    })
}

exports.whitelistDomain = function (req, res) {
  dataLayer.findOnePageObjectUsingQuery({pageId: req.body.page_id, companyId: req.user.companyId})
    .then(page => {
      logger.serverLog(TAG, `page in whitelistDomain ${page}`)
      var accessToken = page.accessToken
      needle.get(`https://graph.facebook.com/v6.0/me/messenger_profile?fields=whitelisted_domains&access_token=${accessToken}`, function (err, resp) {
        if (err) {
        }
        var body = JSON.parse(JSON.stringify(resp.body))
        let temp = []
        if (body.data && body.data.length > 0 && body.data[0].whitelisted_domains) {
          temp = body.data[0].whitelisted_domains
        }
        for (var i = 0; i < req.body.whitelistDomains.length; i++) {
          temp.push(req.body.whitelistDomains[i])
        }
        let whitelistedDomains = {
          whitelisted_domains: temp
        }
        let requesturl = `https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${accessToken}`
        needle.request('post', requesturl, whitelistedDomains, {json: true}, function (err, resp) {
          if (err) {
          }
          if (resp.body.result === 'success') {
            sendSuccessResponse(res, 200, temp)
          } else {
            sendErrorResponse(res, 500, resp.body)
          }
        })
      })
    }).catch(err => {
      logger.serverLog(TAG, `Failed to fetch pages ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.deleteWhitelistDomain = function (req, res) {
  dataLayer.findOnePageObjectUsingQuery({pageId: req.body.page_id, companyId: req.user.companyId})
    .then(page => {
      var accessToken = page.accessToken
      needle.get(`https://graph.facebook.com/v6.0/me/messenger_profile?fields=whitelisted_domains&access_token=${accessToken}`, function (err, resp) {
        if (err) {
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
            return res.status(500).json({status: 'failed', description: 'Domain not found'})
          }
          let whitelistedDomains = {
            whitelisted_domains: temp
          }
          if (temp.length < 1) {
            let requesturl = `https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${accessToken}`
            needle.request('delete', requesturl, {'fields': ['whitelisted_domains']}, {json: true}, function (err, resp) {
              if (err) {
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
            needle.request('post', requesturl, whitelistedDomains, {json: true}, function (err, resp) {
              if (err) {
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
      logger.serverLog(TAG, `Failed to fetch pages ${util.inspect(err)}`)
      return res.status(500).json({status: 'failed', payload: err})
    })
}

exports.updatePageNames = function (req, res) {
  logger.serverLog(TAG, 'Script to update null page names')
  dataLayer.findPageObjects({pageName: null})
    .then(userPages => {
      logger.serverLog(TAG,
        `No.of user page records with Null page names ${userPages.length}`, 'info')
      if (userPages.length < 1) {
        sendSuccessResponse(res, 200, {}, 'There are no records with null Page Names')
      }
      userPages.forEach((page, index) => {
        logger.serverLog(TAG,
          `Page#${index} user access token - ${page.userId.facebookInfo.fbToken}`, 'info')
        needle.get(
          `https://graph.facebook.com/v6.0/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
          (err, resp) => {
            console.log('Page', page.pageId)
            console.log('Page response from Graph API', resp.body)
            if (err) {
              logger.serverLog(TAG,
                `Page#${index} access token from graph api error ${JSON.stringify(
                  err)}`, 'error')
            }
            if (resp.body.error) {
              logger.serverLog(TAG,
                `Page#${index}: Update Page Name Script in Accounts ${JSON.stringify(
                  resp.body.error)}`, 'error')
            }
            if (resp && resp.body && resp.body.access_token) {
              logger.serverLog(TAG,
                `Page#${index} current Access Token ${JSON.stringify(
                  resp.body.access_token)}`, 'info')
              needle.get(
                `https://graph.facebook.com/v6.0/${page.pageId}?fields=name&access_token=${resp.body.access_token}`,
                (err, pageResponse) => {
                  console.log('Page Info Respone', pageResponse.body)
                  if (err) {
                    logger.serverLog(TAG,
                      `Page name from graph api error ${JSON.stringify(
                        err)}`, 'error')
                  }
                  if (pageResponse.body.error) {
                    logger.serverLog(TAG,
                      `Update Page Name Script in Accounts${JSON.stringify(
                        pageResponse.body.error)}`, 'error')
                  }
                  if (pageResponse && pageResponse.body && pageResponse.body.name) {
                    logger.serverLog(TAG,
                      `Page#${index} page name from Graph API - ${pageResponse.body.name}`, 'info')
                    dataLayer.updatePageObject(page._id, {pageName: pageResponse.body.name})
                      .then(result => {
                        console.log('Page updated in database', page._id)
                        logger.serverLog(TAG,
                          `Page#${index} - Page Name:${pageResponse.body.name} saved in Database`, 'info')
                      })
                      .catch(err => {
                        logger.serverLog(TAG,
                          `Unable to save page name ${JSON.stringify(
                            err)}`, 'error')
                      })
                  }
                })
            }
            if (index === (userPages.length - 1)) {
              logger.serverLog(TAG,
                `Successfuly Executed`, 'info')
              sendSuccessResponse(res, 200, {}, 'Successfully Executed')
            }
          })
      })
    })
    .catch(err => {
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
            logger.serverLog(TAG, `default tag created successfully!`)
          })
          .catch(err => {
            logger.serverLog(TAG, `Error at save tag ${util.inspect(err)}`)
          })
      } else {
        logger.serverLog(TAG, `Error at create tag on Facebook ${util.inspect(label.error)}`)
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at create tag on Facebook ${util.inspect(err)}`)
    })
}

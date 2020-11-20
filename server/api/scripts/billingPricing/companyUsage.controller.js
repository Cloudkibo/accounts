const logger = require('../../../components/logger')
const TAG = '/api/scripts/billingPricing/companyUsage.controller.js'
const async = require('async')
const { callApi } = require('../apiCaller')
const CompanyModel = require('../../v1/companyprofile/companyprofile.model')
const CompanyUsageModel = require('../../v1/featureUsage/companyUsage.model')
const MembersModel = require('../../v1/companyuser/companyuser.model')
const TeamsModel = require('../../v1/teams/teams.model')
const IntegrationsModel = require('../../v1/integrations/integrations.model')
const PagesModel = require('../../v1/pages/Pages.model')
const ListsModel = require('../../v1/lists/Lists.model')
const CustomFieldsModel = require('../../v1/custom_fields/custom_field.model')
const TagsModel = require('../../v1/tags/tags.model')
const SubscribersModel = require('../../v1/subscribers/Subscribers.model')
const CommentCaptureModel = require('../../v1/comment_capture/comment_capture.model')
const MessengerCodeModel = require('../../v1/messenger_code/messengerCode.model')
const LandingPagesModel = require('../../v1/landingPage/landingPage.model')
const JsonAdsModel = require('../../v1/jsonAd/jsonAd.model')
const RefUrlsModel = require('../../v1/pageReferrals/pageReferrals.model')
const OverlayWidgetsModel = require('../../v1/overlayWidgets/overlayWidgets.model')
const PhoneInvitationsModel = require('../../v1/phone/Phone.model')

exports.engagementFeatures = function (req, res) {
  CompanyModel.aggregate([
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(companies => {
      if (companies.length > 0) {
        async.each(companies, function (company, cb) {
          const broadcasts = callApi(
            `broadcasts/query`,
            'post',
            {purpose: 'aggregate', match: {companyId: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const polls = callApi(
            `polls/query`,
            'post',
            {purpose: 'aggregate', match: {companyId: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const surveys = callApi(
            `surveys/query`,
            'post',
            {purpose: 'aggregate', match: {companyId: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const broadcastTemplates = callApi(
            `templates/broadcast/query`,
            'post',
            {purpose: 'aggregate', match: {companyId: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const templateCategories = callApi(
            `templates/category/query`,
            'post',
            {purpose: 'aggregate', match: {companyId: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const sponsoredBroadcasts = callApi(
            `sponsoredMessaging/query`,
            'post',
            {purpose: 'aggregate', match: {companyId: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          Promise.all([broadcasts, polls, surveys, broadcastTemplates, templateCategories, sponsoredBroadcasts])
            .then(results => {
              const updated = {
                broadcasts: results[0].length > 0 ? results[0][0].count : 0,
                polls: results[1].length > 0 ? results[1][0].count : 0,
                surveys: results[2].length > 0 ? results[2][0].count : 0,
                broadcast_templates: results[3].length > 0 ? results[3][0].count : 0,
                template_categories: results[4].length > 0 ? results[4][0].count : 0,
                sponsored_broadcasts: results[5].length > 0 ? results[5][0].count : 0,
                polls_templates: 0,
                survey_templates: 0
              }
              CompanyUsageModel.update({companyId: company._id}, updated, {upsert: true}).exec()
                .then(done => {
                  logger.serverLog(TAG, `CompanyUsage updated successfully for ${company._id}`)
                  cb()
                })
                .catch(err => {
                  logger.serverLog(TAG, err, 'error')
                  cb(err)
                })
            })
            .catch(err => {
              logger.serverLog(TAG, err, 'error')
              cb(err)
            })
        }, function (err) {
          if (err) {
            return res.status(500).json({status: 'failed', description: `Failed to normalize ${err}`})
          } else {
            return res.status(200).json({status: 'success', description: 'Normalized successfully'})
          }
        })
      } else {
        return res.status(200).json({status: 'success', description: 'No company found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch companies  ${err}`})
    })
}

exports.supportFeatures = function (req, res) {
  CompanyModel.aggregate([
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(companies => {
      if (companies.length > 0) {
        async.each(companies, function (company, cb) {
          const chatMessagees = callApi(
            `livechat/query`,
            'post',
            {purpose: 'aggregate', match: {company_id: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kibochat'
          )
          const bots = callApi(
            `smart_replies/query`,
            'post',
            {purpose: 'aggregate', match: {companyId: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kibochat'
          )
          const members = MembersModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const teams = TeamsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const integrations = IntegrationsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const chatbotAutomation = callApi(
            `chatbots/query`,
            'post',
            {purpose: 'aggregate', match: {companyId: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kibochat'
          )
          const connectedPages = PagesModel.aggregate([{$match: {companyId: company._id, connected: true}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const lists = ListsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          Promise.all([chatMessagees, bots, members, teams, integrations, chatbotAutomation, connectedPages, lists])
            .then(results => {
              const updated = {
                chat_messages: results[0].length > 0 ? results[0][0].count : 0,
                bots: results[1].length > 0 ? results[1][0].count : 0,
                members: results[2].length > 0 ? results[2][0].count : 0,
                teams: results[3].length > 0 ? results[3][0].count : 0,
                external_integrations: results[4].length > 0 ? results[4][0].count : 0,
                chatbot_automation: results[5].length > 0 ? results[5][0].count : 0,
                facebook_pages: results[6].length > 0 ? results[6][0].count : 0,
                segmentation_lists: results[7].length > 0 ? results[7][0].count : 0
              }
              CompanyUsageModel.update({companyId: company._id}, updated, {upsert: true}).exec()
                .then(done => {
                  logger.serverLog(TAG, `CompanyUsage updated successfully for ${company._id}`)
                  cb()
                })
                .catch(err => {
                  logger.serverLog(TAG, err, 'error')
                  cb(err)
                })
            })
            .catch(err => {
              logger.serverLog(TAG, err, 'error')
              cb(err)
            })
        }, function (err) {
          if (err) {
            return res.status(500).json({status: 'failed', description: `Failed to normalize ${err}`})
          } else {
            return res.status(200).json({status: 'success', description: 'Normalized successfully'})
          }
        })
      } else {
        return res.status(200).json({status: 'success', description: 'No company found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch companies  ${err}`})
    })
}

exports.automationFeatures = function (req, res) {
  CompanyModel.aggregate([
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(companies => {
      if (companies.length > 0) {
        async.each(companies, function (company, cb) {
          const facebookAutoposting = callApi(
            `autoposting/query`,
            'post',
            {purpose: 'aggregate', match: {company_id: company._id, subscriptionType: 'facebook'}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const twitterAutoposting = callApi(
            `autoposting/query`,
            'post',
            {purpose: 'aggregate', match: {company_id: company._id, subscriptionType: 'twitter'}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const wordpressAutoposting = callApi(
            `autoposting/query`,
            'post',
            {purpose: 'aggregate', match: {company_id: company._id, subscriptionType: 'wordpress'}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const sequences = callApi(
            `sequence_messaging/query`,
            'post',
            {purpose: 'aggregate', match: {company_id: company._id}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const rss = callApi(
            `newsSections/query`,
            'post',
            {purpose: 'aggregate', match: {company_id: company._id, integrationType: 'rss'}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const newsIntegrations = callApi(
            `newsSections/query`,
            'post',
            {purpose: 'aggregate', match: {company_id: company._id, integrationType: 'manual'}, group: {_id: 'null', count: {$sum: 1}}},
            undefined,
            'kiboengage'
          )
          const customFields = CustomFieldsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const tags = TagsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          Promise.all([facebookAutoposting, twitterAutoposting, wordpressAutoposting, sequences, rss, newsIntegrations, customFields, tags])
            .then(results => {
              const updated = {
                facebook_autoposting: results[0].length > 0 ? results[0][0].count : 0,
                twitter_autoposting: results[1].length > 0 ? results[1][0].count : 0,
                wordpress_autoposting: results[2].length > 0 ? results[2][0].count : 0,
                broadcast_sequences: results[3].length > 0 ? results[3][0].count : 0,
                rss_feeds: results[4].length > 0 ? results[4][0].count : 0,
                news_integration_feeds: results[5].length > 0 ? results[5][0].count : 0,
                custom_fields: results[6].length > 0 ? results[6][0].count : 0,
                tags: results[7].length > 0 ? results[7][0].count : 0
              }
              CompanyUsageModel.update({companyId: company._id}, updated, {upsert: true}).exec()
                .then(done => {
                  logger.serverLog(TAG, `CompanyUsage updated successfully for ${company._id}`)
                  cb()
                })
                .catch(err => {
                  logger.serverLog(TAG, err, 'error')
                  cb(err)
                })
            })
            .catch(err => {
              logger.serverLog(TAG, err, 'error')
              cb(err)
            })
        }, function (err) {
          if (err) {
            return res.status(500).json({status: 'failed', description: `Failed to normalize ${err}`})
          } else {
            return res.status(200).json({status: 'success', description: 'Normalized successfully'})
          }
        })
      } else {
        return res.status(200).json({status: 'success', description: 'No company found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch companies  ${err}`})
    })
}

exports.otherFeatures = function (req, res) {
  CompanyModel.aggregate([
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(companies => {
      if (companies.length > 0) {
        async.each(companies, function (company, cb) {
          const subscribers = SubscribersModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const commentCapture = CommentCaptureModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const messengerCode = MessengerCodeModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const landingPage = LandingPagesModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const jsonAds = JsonAdsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const refUrls = RefUrlsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const overlayWidgets = OverlayWidgetsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          const phoneInvitations = PhoneInvitationsModel.aggregate([{$match: {companyId: company._id}}, {$group: {_id: null, count: {$sum: 1}}}]).exec()
          Promise.all([subscribers, commentCapture, messengerCode, landingPage, jsonAds, refUrls, overlayWidgets, phoneInvitations])
            .then(results => {
              const updated = {
                subscribers: results[0].length > 0 ? results[0][0].count : 0,
                comment_capture_rules: results[1].length > 0 ? results[1][0].count : 0,
                messenger_codes: results[2].length > 0 ? results[2][0].count : 0,
                landing_pages: results[3].length > 0 ? results[3][0].count : 0,
                json_ads: results[4].length > 0 ? results[4][0].count : 0,
                messenger_ref_urls: results[5].length > 0 ? results[5][0].count : 0,
                overlay_widgets: results[6].length > 0 ? results[6][0].count : 0,
                phone_invitation: results[7].length > 0 ? results[7][0].count : 0
              }
              CompanyUsageModel.update({companyId: company._id}, updated, {upsert: true}).exec()
                .then(done => {
                  logger.serverLog(TAG, `CompanyUsage updated successfully for ${company._id}`)
                  cb()
                })
                .catch(err => {
                  logger.serverLog(TAG, err, 'error')
                  cb(err)
                })
            })
            .catch(err => {
              logger.serverLog(TAG, err, 'error')
              cb(err)
            })
        }, function (err) {
          if (err) {
            return res.status(500).json({status: 'failed', description: `Failed to normalize ${err}`})
          } else {
            return res.status(200).json({status: 'success', description: 'Normalized successfully'})
          }
        })
      } else {
        return res.status(200).json({status: 'success', description: 'No company found'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch companies  ${err}`})
    })
}

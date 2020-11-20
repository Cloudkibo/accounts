const logger = require('../../../components/logger')
const TAG = '/api/scripts/billingPricing/permissions.controller.js'
const async = require('async')
const RolePermissionsModel = require('../../v1/permissions/rolePermissions.model')
const UserPermissionsModel = require('../../v1/permissions/permissions.model')
const CompanyUsersModel = require('../../v1/companyuser/companyuser.model')

exports.rolePermissions = function (req, res) {
  const buyer = {
    connect_facebook_account: true,
    invite_members: true,
    delete_members: true,
    update_role: true,
    view_members: true,
    create_teams: true,
    view_teams: true,
    update_teams: true,
    delete_teams: true,
    view_subscribers: true,
    assign_tags: true,
    set_custom_fields: true,
    export_subscribers: true,
    create_custom_fields: true,
    view_custom_fields: true,
    update_custom_fields: true,
    delete_custom_fields: true,
    create_tags: true,
    view_tags: true,
    update_tags: true,
    delete_tags: true,
    create_broadcasts: true,
    view_broadcasts: true,
    create_polls: true,
    view_polls: true,
    delete_polls: true,
    view_poll_reports: true,
    resend_polls: true,
    create_surveys: true,
    view_surveys: true,
    delete_surveys: true,
    view_survey_reports: true,
    resend_surveys: true,
    create_segmentation_lists: true,
    view_segmentation_lists: true,
    update_segmentation_lists: true,
    delete_segmentation_lists: true,
    create_templates: true,
    view_templates: true,
    update_templates: true,
    delete_templates: true,
    create_comment_capture_rules: true,
    view_comment_capture_rules: true,
    update_comment_capture_rules: true,
    delete_comment_capture_rules: true,
    invite_subscribers_using_phone_number: true,
    manage_facebook_pages: true,
    set_persistent_menu: true,
    manage_welcome_message: true,
    manage_greeting_text: true,
    manage_livechat: true,
    unsubsubscribe_subscribers: true,
    assign_session_agent: true,
    assign_session_team: true,
    manage_advanced_settings: true,
    manage_billing: true,
    upgrade_service: true,
    downgrade_service: true,
    create_messenger_codes: true,
    view_messenger_codes: true,
    update_messenger_codes: true,
    delete_messenger_codes: true,
    create_messnger_ref_urls: true,
    view_messenger_ref_urls: true,
    update_messenger_ref_urls: true,
    delete_messenger_ref_urls: true,
    manage_integrations: true,
    manage_webhooks: true,
    delete_account_information: true,
    add_autoposting_feeds: true,
    view_autoposting_feeds: true,
    update_autoposting_feeds: true,
    delete_autoposting_feeds: true,
    enable_disable_autoposting_feeds: true,
    view_autoposting_feed_history: true,
    create_sequences: true,
    view_sequences: true,
    update_sequences: true,
    delete_sequences: true,
    create_sponsored_broadcast: true,
    create_campaign: true,
    create_adset: true,
    create_ad: true,
    update_sponsored_broadcast: true,
    view_sponsored_broadcast: true,
    delete_sponsored_broadcast: true,
    publish_sponsored_broadcast: true,
    schedule_sponsored_broadcast: true,
    create_bots: true,
    train_bots: true,
    update_bots: true,
    view_bots: true,
    delete_bots: true,
    add_rss_feeds: true,
    view_rss_fedds: true,
    update_rss_feeds: true,
    delete_rss_feeds: true,
    enable_disable_rss_feeds: true,
    view_rss_feed_history: true,
    add_news_feeds: true,
    view_news_fedds: true,
    update_news_feeds: true,
    delete_news_feeds: true,
    enable_disable_news_feeds: true,
    view_news_feed_history: true,
    update_news_feed_stories: true,
    create_chatbot_automation: true,
    update_chatbot_automation: true,
    configure_chatbot_automation: true
  }
  const admin = {
    connect_facebook_account: false,
    invite_members: true,
    delete_members: true,
    update_role: true,
    view_members: true,
    create_teams: true,
    view_teams: true,
    update_teams: true,
    delete_teams: true,
    view_subscribers: true,
    assign_tags: true,
    set_custom_fields: true,
    export_subscribers: true,
    create_custom_fields: true,
    view_custom_fields: true,
    update_custom_fields: true,
    delete_custom_fields: true,
    create_tags: true,
    view_tags: true,
    update_tags: true,
    delete_tags: true,
    create_broadcasts: true,
    view_broadcasts: true,
    create_polls: true,
    view_polls: true,
    delete_polls: true,
    view_poll_reports: true,
    resend_polls: true,
    create_surveys: true,
    view_surveys: true,
    delete_surveys: true,
    view_survey_reports: true,
    resend_surveys: true,
    create_segmentation_lists: true,
    view_segmentation_lists: true,
    update_segmentation_lists: true,
    delete_segmentation_lists: true,
    create_templates: true,
    view_templates: true,
    update_templates: true,
    delete_templates: true,
    create_comment_capture_rules: true,
    view_comment_capture_rules: true,
    update_comment_capture_rules: true,
    delete_comment_capture_rules: true,
    invite_subscribers_using_phone_number: true,
    manage_facebook_pages: true,
    set_persistent_menu: true,
    manage_welcome_message: true,
    manage_greeting_text: true,
    manage_livechat: true,
    unsubsubscribe_subscribers: true,
    assign_session_agent: true,
    assign_session_team: true,
    manage_advanced_settings: true,
    manage_billing: false,
    upgrade_service: false,
    downgrade_service: false,
    create_messenger_codes: true,
    view_messenger_codes: true,
    update_messenger_codes: true,
    delete_messenger_codes: true,
    create_messnger_ref_urls: true,
    view_messenger_ref_urls: true,
    update_messenger_ref_urls: true,
    delete_messenger_ref_urls: true,
    manage_integrations: true,
    manage_webhooks: true,
    delete_account_information: false,
    add_autoposting_feeds: true,
    view_autoposting_feeds: true,
    update_autoposting_feeds: true,
    delete_autoposting_feeds: true,
    enable_disable_autoposting_feeds: true,
    view_autoposting_feed_history: true,
    create_sequences: true,
    view_sequences: true,
    update_sequences: true,
    delete_sequences: true,
    create_sponsored_broadcast: true,
    create_campaign: true,
    create_adset: true,
    create_ad: true,
    update_sponsored_broadcast: true,
    view_sponsored_broadcast: true,
    delete_sponsored_broadcast: true,
    publish_sponsored_broadcast: true,
    schedule_sponsored_broadcast: true,
    create_bots: true,
    train_bots: true,
    update_bots: true,
    view_bots: true,
    delete_bots: true,
    add_rss_feeds: true,
    view_rss_fedds: true,
    update_rss_feeds: true,
    delete_rss_feeds: true,
    enable_disable_rss_feeds: true,
    view_rss_feed_history: true,
    add_news_feeds: true,
    view_news_fedds: true,
    update_news_feeds: true,
    delete_news_feeds: true,
    enable_disable_news_feeds: true,
    view_news_feed_history: true,
    update_news_feed_stories: true,
    create_chatbot_automation: true,
    update_chatbot_automation: true,
    configure_chatbot_automation: true
  }
  const agent = {
    connect_facebook_account: false,
    invite_members: false,
    delete_members: false,
    update_role: false,
    view_members: true,
    create_teams: false,
    view_teams: true,
    update_teams: false,
    delete_teams: false,
    view_subscribers: true,
    assign_tags: true,
    set_custom_fields: true,
    export_subscribers: true,
    create_custom_fields: true,
    view_custom_fields: true,
    update_custom_fields: true,
    delete_custom_fields: true,
    create_tags: true,
    view_tags: true,
    update_tags: true,
    delete_tags: true,
    create_broadcasts: true,
    view_broadcasts: true,
    create_polls: true,
    view_polls: true,
    delete_polls: false,
    view_poll_reports: true,
    resend_polls: true,
    create_surveys: true,
    view_surveys: true,
    delete_surveys: false,
    view_survey_reports: true,
    resend_surveys: true,
    create_segmentation_lists: true,
    view_segmentation_lists: true,
    update_segmentation_lists: true,
    delete_segmentation_lists: true,
    create_templates: false,
    view_templates: false,
    update_templates: false,
    delete_templates: false,
    create_comment_capture_rules: true,
    view_comment_capture_rules: true,
    update_comment_capture_rules: true,
    delete_comment_capture_rules: true,
    invite_subscribers_using_phone_number: true,
    manage_facebook_pages: false,
    set_persistent_menu: true,
    manage_welcome_message: true,
    manage_greeting_text: true,
    manage_livechat: true,
    unsubsubscribe_subscribers: false,
    assign_session_agent: false,
    assign_session_team: false,
    manage_advanced_settings: false,
    manage_billing: false,
    upgrade_service: false,
    downgrade_service: false,
    create_messenger_codes: true,
    view_messenger_codes: true,
    update_messenger_codes: true,
    delete_messenger_codes: false,
    create_messnger_ref_urls: true,
    view_messenger_ref_urls: true,
    update_messenger_ref_urls: true,
    delete_messenger_ref_urls: false,
    manage_integrations: false,
    manage_webhooks: false,
    delete_account_information: false,
    add_autoposting_feeds: false,
    view_autoposting_feeds: true,
    update_autoposting_feeds: false,
    delete_autoposting_feeds: false,
    enable_disable_autoposting_feeds: false,
    view_autoposting_feed_history: true,
    create_sequences: true,
    view_sequences: true,
    update_sequences: true,
    delete_sequences: false,
    create_sponsored_broadcast: true,
    create_campaign: false,
    create_adset: false,
    create_ad: true,
    update_sponsored_broadcast: true,
    view_sponsored_broadcast: true,
    delete_sponsored_broadcast: false,
    publish_sponsored_broadcast: false,
    schedule_sponsored_broadcast: false,
    create_bots: false,
    train_bots: true,
    update_bots: false,
    view_bots: true,
    delete_bots: false,
    add_rss_feeds: false,
    view_rss_fedds: true,
    update_rss_feeds: false,
    delete_rss_feeds: false,
    enable_disable_rss_feeds: false,
    view_rss_feed_history: true,
    add_news_feeds: false,
    view_news_fedds: true,
    update_news_feeds: false,
    delete_news_feeds: false,
    enable_disable_news_feeds: false,
    view_news_feed_history: true,
    update_news_feed_stories: true,
    create_chatbot_automation: false,
    update_chatbot_automation: false,
    configure_chatbot_automation: true
  }
  const updateBuyer = RolePermissionsModel.update({role: 'buyer'}, buyer).exec()
  const updateAdmin = RolePermissionsModel.update({role: 'admin'}, admin).exec()
  const updateAgent = RolePermissionsModel.update({role: 'agent'}, agent).exec()
  Promise.all([updateBuyer, updateAdmin, updateAgent])
    .then(done => {
      return res.status(200).json({status: 'success', description: 'Normalized successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', description: `Failed to normalize role permissions ${err}`})
    })
}

exports.userPermissions = function (req, res) {
  const buyerPromise = RolePermissionsModel.findOne({role: 'buyer'}).exec()
  const adminPromise = RolePermissionsModel.findOne({role: 'admin'}).exec()
  const agentPromise = RolePermissionsModel.findOne({role: 'agent'}).exec()
  Promise.all([buyerPromise, adminPromise, agentPromise])
    .then(results => {
      let buyer = results[0].toObject()
      delete buyer._id
      delete buyer.__v
      delete buyer.role
      let admin = results[1].toObject()
      delete admin._id
      delete admin.__v
      delete admin.role
      let agent = results[2].toObject()
      delete agent._id
      delete agent.__v
      delete agent.role
      CompanyUsersModel.aggregate([
        {$skip: req.body.skip},
        {$limit: req.body.limit}
      ]).exec()
        .then(users => {
          if (users.length > 0) {
            console.log(buyer)
            async.each(users, function (user, cb) {
              const updated = user.role === 'buyer' ? buyer : user.role === 'admin' ? admin : agent
              UserPermissionsModel.update({userId: user.userId}, updated, {upsert: true}).exec()
                .then(done => {
                  logger.serverLog(TAG, `UserPermissions normalized for ${user.userId}`)
                  cb()
                })
                .catch(err => {
                  logger.serverLog(TAG, err, 'error')
                  cb(err)
                })
            }, function (err) {
              if (err) {
                return res.status(500).json({status: 'failed', description: `Failed to normalize users permissions ${err}`})
              } else {
                return res.status(200).json({status: 'success', description: 'Normalized successfully!'})
              }
            })
          } else {
            return res.status(200).json({status: 'success', description: 'No user found'})
          }
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', description: `Failed to fetch company users ${err}`})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', description: `Failed to fetch role permissions ${err}`})
    })
}

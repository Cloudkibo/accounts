const logger = require('../../../components/logger')
// const logicLayer = require('./permissions_plan.logiclayer')
const dataLayer = require('./permissions_plan.datalayer')
const TAG = '/api/v1/permissions_plan/permissions_plan.controller.js'
const PlanModel = require('../plans/plans.model')
const Features = require('./Permissions_Plan.model')
const util = require('util')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {

  dataLayer.findOnePermissionsPlanObject(req.params._id)
    .then(permissionPlanObject => {
      sendSuccessResponse(res, 200, permissionPlanObject)
    })
    .catch(err => {
      const message = err || 'Failed to Find permission Plan'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  dataLayer.createPermissionsPlanObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to create permission Plan'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {

  dataLayer.updatePermissionsPlanObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to update permission Plan'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {

  dataLayer.deletePermissionsPlanObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to delete permission Plan'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {

  dataLayer.findallPermissionsPlanObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to querying permission Plan'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')  
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {

  dataLayer.aggregateInfo(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || 'Failed to aggregate permission Plan'
      logger.serverLog(message, `${TAG}: exports.query`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.populatePlanPermissions = function (req, res) {
  PlanModel.find({}, (err, plans) => {
    if (err) {
      const message = err || 'Failed to find Plan Model'
      logger.serverLog(message, `${TAG}: exports.populatePlanPermissions`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    }
    plans.forEach((plan, index) => {
      if (plan.unique_ID === 'plan_A') {
        let featuresData = {
          plan_id: plan._id,
          customer_matching: true,
          invite_team: false,
          dashboard: true,
          broadcasts: true,
          broadcasts_templates: true,
          polls: true,
          polls_reports: true,
          surveys: true,
          surveys_reports: true,
          csv_exports: true,
          livechat: true,
          autoposting: true,
          menu: true,
          manage_pages: true,
          manage_subscribers: true,
          subscribe_to_messenger: true,
          team_members_management: false,
          messenger_links: true,
          comment_capture: true,
          messenger_code: true,
          analytics: true,
          api: true,
          advanced_segmentation: true,
          buy_button: true,
          segmentation_lists: true,
          user_permissions: false,
          greeting_text: true,
          welcome_message: true,
          html_widget: true,
          livechat_response_methods: true,
          kibopush_widget: true,
          webhook: true,
          survey_templates: true,
          poll_templates: true
        }
        let feature = new Features(featuresData)
        feature.save((err) => {
          if (err) {
            const message = err || 'Failed to insert record1'
            logger.serverLog(message, `${TAG}: exports.populatePlanPermissions`, req.body, {user: req.user}, 'error')      
            sendErrorResponse(res, 500, 'Failed to insert record1')
          }
        })
      } else if (plan.unique_ID === 'plan_B') {
        let featuresData = {
          plan_id: plan._id,
          customer_matching: false,
          invite_team: false,
          dashboard: true,
          broadcasts: true,
          broadcasts_templates: false,
          polls: true,
          polls_reports: true,
          surveys: true,
          surveys_reports: true,
          csv_exports: false,
          livechat: true,
          autoposting: true,
          menu: true,
          manage_pages: true,
          manage_subscribers: true,
          subscribe_to_messenger: true,
          team_members_management: false,
          messenger_links: true,
          comment_capture: false,
          messenger_code: false,
          analytics: false,
          api: false,
          advanced_segmentation: false,
          buy_button: false,
          segmentation_lists: true,
          user_permissions: false,
          greeting_text: true,
          welcome_message: true,
          html_widget: true,
          livechat_response_methods: false,
          kibopush_widget: false,
          webhook: false,
          survey_templates: false,
          poll_templates: false
        }
        let feature = new Features(featuresData)
        feature.save((err) => {
          if (err) {
            const message = err || 'Failed to insert record2'
            logger.serverLog(message, `${TAG}: exports.populatePlanPermissions`, req.body, {user: req.user}, 'error')      
            sendErrorResponse(res, 500, 'Failed to insert record2')
          }
        })
      } if (plan.unique_ID === 'plan_C') {
        let featuresData = {
          plan_id: plan._id,
          customer_matching: true,
          invite_team: true,
          dashboard: true,
          broadcasts: true,
          broadcasts_templates: true,
          polls: true,
          polls_reports: true,
          surveys: true,
          surveys_reports: true,
          csv_exports: true,
          livechat: true,
          autoposting: true,
          menu: true,
          manage_pages: true,
          manage_subscribers: true,
          subscribe_to_messenger: true,
          team_members_management: true,
          messenger_links: true,
          comment_capture: true,
          messenger_code: true,
          analytics: true,
          api: true,
          advanced_segmentation: true,
          buy_button: true,
          segmentation_lists: true,
          user_permissions: true,
          greeting_text: true,
          welcome_message: true,
          html_widget: true,
          livechat_response_methods: true,
          kibopush_widget: true,
          webhook: true,
          survey_templates: true,
          poll_templates: true
        }
        let feature = new Features(featuresData)
        feature.save((err) => {
          if (err) {
            const message = err || 'Failed to insert record3'
            logger.serverLog(message, `${TAG}: exports.populatePlanPermissions`, req.body, {user: req.user}, 'error')
            sendErrorResponse(res, 500, 'Failed to insert record3')
          }
        })
      } if (plan.unique_ID === 'plan_D') {
        let featuresData = {
          plan_id: plan._id,
          customer_matching: false,
          invite_team: true,
          dashboard: true,
          broadcasts: true,
          broadcasts_templates: false,
          polls: true,
          polls_reports: true,
          surveys: true,
          surveys_reports: true,
          csv_exports: false,
          livechat: true,
          autoposting: true,
          menu: true,
          manage_pages: true,
          manage_subscribers: true,
          subscribe_to_messenger: true,
          team_members_management: true,
          messenger_links: true,
          comment_capture: false,
          messenger_code: false,
          analytics: false,
          api: false,
          advanced_segmentation: false,
          buy_button: false,
          segmentation_lists: true,
          user_permissions: true,
          greeting_text: true,
          welcome_message: true,
          html_widget: true,
          livechat_response_methods: false,
          kibopush_widget: false,
          webhook: false,
          survey_templates: false,
          poll_templates: false
        }
        let feature = new Features(featuresData)
        feature.save((err) => {
          if (err) {
            const message = err || 'Failed to insert record4'
            logger.serverLog(message, `${TAG}: exports.populatePlanPermissions`, req.body, {user: req.user}, 'error')      
            sendErrorResponse(res, 500, 'Failed to insert record4')
          }
        })
      }
      if (index === (plans.length - 1)) {
        sendSuccessResponse(res, 200, '', 'Successfuly populated!')
      }
    })
  })
}

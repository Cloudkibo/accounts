const logger = require('../../../components/logger')
// const logicLayer = require('./permissions_plan.logiclayer')
const dataLayer = require('./permissions_plan.datalayer')
const TAG = '/api/v1/permissions_plan/permissions_plan.controller.js'
const PlanModel = require('../plans/plans.model')
const Features = require('./Permissions_Plan.model')
const util = require('util')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the find permissionPlan controller index')

  dataLayer.findOnePermissionsPlanObject(req.params._id)
    .then(permissionPlanObject => {
      sendSuccessResponse(res, 200, permissionPlanObject)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create permissionPlan controller index')
  dataLayer.createPermissionsPlanObject(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      sendErrorResponse(res, 500, err)
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update permissionPlan controller index')

  dataLayer.updatePermissionsPlanObject(req.params._id, req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at update permissionPlan ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete permissionPlan controller index')

  dataLayer.deletePermissionsPlanObject(req.params._id)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at delete permissionPlan ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for permissionPlan controller')

  dataLayer.findallPermissionsPlanObjects(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at querying permissionPlan ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.aggregate = function (req, res) {
  logger.serverLog(TAG, 'Hit the aggregate endpoint for permissionPlan controller')

  dataLayer.aggregateInfo(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      logger.serverLog(TAG, `Error at aggregate permissionPlan ${util.inspect(err)}`)
      sendErrorResponse(res, 500, err)
    })
}

exports.populatePlanPermissions = function (req, res) {
  PlanModel.find({}, (err, plans) => {
    if (err) {
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

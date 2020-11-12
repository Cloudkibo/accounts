const logger = require('../../../components/logger')
const config = require('./../../../config/environment/index')
const logicLayer = require('./plans.logiclayer')
const dataLayer = require('./plans.datalayer')
const CompanyDataLayer = require('./../companyprofile/companyprofile.datalayer')
const stripeOptions = config.stripeOptions
const Stripe = require('stripe')
const stripe = Stripe(stripeOptions.apiKey)
const TAG = '/api/v1/plans/plans.controller.js'
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')
const util = require('util')

exports.index = function (req, res) {
  dataLayer
    .findAllPlanObjectsUsingQuery({})
    .then(plans => {
      let respPayload
      plans.forEach(plan => {
        CompanyDataLayer
          .findPostObjectUsingAggregate([{
            $match: {planId: plan._id}
          }, {
            $group: {_id: null, count: {$sum: 1}}
          }])
          .then(count => {
            plan = plan.toObject()
            plan.companyCount = count.length > 0 ? count[0].count : 0
            respPayload.push(plan)
            if (respPayload.length === plans.length) {
              sendSuccessResponse(res, 200, respPayload)
            }
          })
          .catch(err => {
            const message = err || 'Error in getting companies count'
            logger.serverLog(message, `${TAG}: exports.index`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
            sendErrorResponse(res, 500, '', `Error in getting companies count ${JSON.stringify(err)}`)
          })
      })
    })
    .catch(err => {
      const message = err || 'Failed to find All plan'
      logger.serverLog(message, `${TAG}: exports.index`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.create = function (req, res) {
  dataLayer
    .findAllPlanObjectsUsingQuery({})
    .then(plans => {
      let uid = logicLayer.prepareUID(plans)
      let preparePlanDataPayload = logicLayer.preparePlanDataPayload(req.body, uid)
      dataLayer
        .createPlanObject(preparePlanDataPayload)
        .then(plan => {
          let stripePayload = logicLayer.prepareStripePayload(req.body, uid, stripeOptions)
          stripe.plans.create(stripePayload, (err, plan) => {
            if (err) {
              const message = err || 'Error creating plan on stripe'
              logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
              sendErrorResponse(res, 500, '', `Failed to create plan on stripe ${JSON.stringify(err)}`)
            }
            sendSuccessResponse(res, 200, '', 'Plan has been created successfully!')
          })
        })
    })
    .catch(err => {
      const message = err || 'Error in finding Plans'
      logger.serverLog(message, `${TAG}: exports.create`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.update = function (req, res) {
  let query = {unique_ID: req.body.unique_id}
  let updated = {$set: {name: req.body.name,
    interval: req.body.interval,
    trial_period: req.body.trial_period
  }}
  dataLayer
    .genericUpdatePlanObject(query, updated, {})
    .then(result => {
      stripe.plans.update(req.body.unique_id, {
        nickname: req.body.name,
        trial_period_days: req.body.trial_period
      }, (err, plan) => {
        err
          ? logger.serverLog(err, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          : logger.serverLog(`updated plan on stripe. ${util.inspect(plan)}`, `${TAG}: exports.update`)

        plan
          ? sendSuccessResponse(res, 200, '', 'Plan has been updated successfully!')
          : sendErrorResponse(res, 500, '', `Failed to update plan on stripe ${util.inspect(err)}`)
      })
    })
    .catch(err => {
      const message = err || 'Error in finding Plans'
      logger.serverLog(message, `${TAG}: exports.update`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.delete = function (req, res) {
  dataLayer
    .deletePlanObjectUsingQuery({unique_ID: req.params.id})
    .then(result => {
      stripe.plans.del(req.params.unique_id, (err, confirmation) => {
        err
          ? logger.serverLog(err, `${TAG}: exports.delete`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          : logger.serverLog(`delete plan on stripe. ${util.inspect(confirmation)}`, `${TAG}: exports.delete`)

        confirmation
          ? sendSuccessResponse(res, 200, '', 'Plan has been updated successfully!')
          : sendErrorResponse(res, 500, '', `Failed to update plan on stripe ${util.inspect(err)}`)
      })
    })
    .catch(err => {
      const message = err || 'Error in finding Plans'
      logger.serverLog(message, `${TAG}: exports.delete`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.changeDefaultPlan = function (req, res) {
  let criteria1 = {}
  let criteria2 = {}
  if (req.body.account_type === 'individual') {
    criteria1 = {default_individual: true}
    criteria2 = {default_individual: false}
  } else if (req.body.account_type === 'team') {
    criteria1 = {default_team: true}
    criteria2 = {default_team: false}
  }

  // remove previous default
  let prevDefaultPromise = dataLayer
    .genericUpdatePlanObject(criteria1, criteria2, {})

  let createNewDefault = dataLayer
    .genericUpdatePlanObject({_id: req.body.plan_id}, criteria1, {})

  Promise.all([prevDefaultPromise, createNewDefault])
    .then(result => {
      sendSuccessResponse(res, 200, '', 'Default plan changed successfully!')
    })
    .catch(err => {
      const message = err || '`Error in changing default Plan'
      logger.serverLog(message, `${TAG}: exports.changeDefaultPlan`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.migrateCompanies = function (req, res) {
  let query = {planId: req.body.from.id}
  let updated = {planId: req.body.to.id}
  let options = {multi: true}

  CompanyDataLayer
    .genericUpdatePostObject(query, updated, options)
    .then(result => {
      // migrate subscriptions from stripe
      stripe.subscriptions.list({ plan: req.body.from.unique_id }, (err, subscriptions) => {
        err
          ? logger.serverLog(`Failed to delete plan on stripe. ${util.inspect(err)}`, `${TAG}: exports.migrateCompanies`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
          : logger.serverLog(`Subscriptions found ${util.inspect(subscriptions)}`, `${TAG}: exports.migrateCompanies`)

        subscriptions.data.forEach((customer, index) => {
          stripe.subscriptions.update(customer.id,
            {
              cancel_at_period_end: false,
              items: [{
                id: customer.items.data[0].id,
                plan: req.body.to.unique_id
              }]
            },
            (err2, subscription) => {
              if (err2) {
                const message = err || '`Error in Migration Companies'
                logger.serverLog(message, `${TAG}: exports.migrateCompanies`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')          
                sendErrorResponse(res, 500, '', err2)
              }
              if (index === (subscriptions.data.length - 1)) {
                sendSuccessResponse(res, 200, '', 'Migrated successfuly!')
              }
            })
        })
      })
    })
    .catch(err => {
      const message = err || '`Error in Update Companies'
      logger.serverLog(message, `${TAG}: exports.migrateCompanies`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')          
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.populatePlan = function (req, res) {
  let promisePlanA = dataLayer.createPlanObject(logicLayer.planAPayload())
  let promisePlanB = dataLayer.createPlanObject(logicLayer.planBPayload())
  let promisePlanC = dataLayer.createPlanObject(logicLayer.planCPayload())
  let promisePlanD = dataLayer.createPlanObject(logicLayer.planDPayload())

  Promise.all([promisePlanA, promisePlanB, promisePlanC, promisePlanD])
    .then(result => {
      sendSuccessResponse(res, 200, '', 'Successfuly populated!')
    })
    .catch(err => {
      const message = err || '`Error in populate Plan '
      logger.serverLog(message, `${TAG}: exports.populatePlan`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, '', `Internal Server Error ${JSON.stringify(err)}`)
    })
}

exports.fetchAll = function (req, res) {

  dataLayer.findAllPlanObject()
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || '`Error in find All plan '
      logger.serverLog(message, `${TAG}: exports.fetchAll`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

exports.genericFetch = function (req, res) {
  dataLayer
    .findAllPlanObjectsUsingQuery(req.body)
    .then(result => {
      sendSuccessResponse(res, 200, result)
    })
    .catch(err => {
      const message = err || '`Error in find All plan '
      logger.serverLog(message, `${TAG}: exports.genericFetch`, req.body, {companyId: req.user.companyId, user: req.user}, 'error')
      sendErrorResponse(res, 500, err)
    })
}

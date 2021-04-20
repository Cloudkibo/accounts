const PlansModel = require('../../v1/plans/plans.model')
const PlanUsageModel = require('../../v1/featureUsage/planUsage.model')
const CompanyUsageModel = require('../../v1/featureUsage/companyUsage.model')
const CompanyProfileModel = require('../../v1/companyprofile/companyprofile.model')

const { smsPlans } = require('./data')
const async = require('async')

exports.populatePlans = function (req, res) {
  const basicPlan = PlansModel.updateOne({unique_ID: 'sms_plan_A'}, smsPlans.basic, {upsert: true}).exec()
  const standardPlan = PlansModel.updateOne({unique_ID: 'sms_plan_B'}, smsPlans.standard, {upsert: true}).exec()
  const premiumPlan = PlansModel.updateOne({unique_ID: 'sms_plan_C'}, smsPlans.premium, {upsert: true}).exec()
  const enterprisePlan = PlansModel.updateOne({unique_ID: 'sms_plan_D'}, smsPlans.enterprise, {upsert: true}).exec()

  Promise.all([basicPlan, standardPlan, premiumPlan, enterprisePlan])
    .then(result => {
      return res.status(200).json({status: 'success', description: 'Populated successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', description: err})
    })
}
exports.populatePlanUsage = function (req, res) {
  PlansModel.find({platform: 'sms'})
    .then(plans => {
      async.each(plans, insertPlanUsage, function (err) {
        if (err) {
          res.status(500).json({status: 'failed', payload: err})
        } else {
          res.status(200).json({status: 'success', payload: 'Populated successfully!'})
        }
      })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', description: err})
    })
}
function insertPlanUsage (plan, callback) {
  if (plan.unique_ID !== 'sms_plan_D') {
    let payload = {
      planId: plan._id,
      broadcasts: -1,
      sessions: -1,
      chat_messages: -1,
      subscribers: -1,
      messages: plan.unique_ID === 'sms_plan_A' ? 5000 : plan.unique_ID === 'sms_plan_B' ? 7500 : 10000
    }
    PlanUsageModel.updateOne({planId: plan._id}, payload, {upsert: true}).exec()
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
exports.normalizeData = function (req, res) {
  const plans = PlansModel.update({platform: {$exists: false}}, {$set: {platform: 'messenger'}}, {multi: true})
  const companyUsage = CompanyUsageModel.update({platform: {$exists: false}}, {$set: {platform: 'messenger'}}, {multi: true})
  const companyProfiles = CompanyProfileModel.find({twilio: {$exists: true}})
  Promise.all([plans, companyUsage, companyProfiles])
    .then(result => {
      if (result[2].length > 0) {
        async.each(result[2], updateCompany, function (err) {
          if (err) {
            res.status(500).json({status: 'failed', payload: err})
          } else {
            res.status(200).json({status: 'success', payload: 'normalized successfully!'})
          }
        })
      } else {
        return res.status(200).json({status: 'success', description: 'normalized successfully!'})
      }
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', description: err})
    })
}
function updateCompany (company, callback) {
  let payload = {
    $set: {
      sms: {
        provider: 'twilio',
        accountSID: company.twilio.accountSID,
        authToken: company.twilio.authToken
      }
    },
    $unset: {
      twilio: 1
    }
  }
  CompanyProfileModel.updateOne({_id: company._id}, payload, {strict: false}).exec()
    .then(result => {
      console.log('result', result)
      callback()
    })
    .catch(err => {
      callback(err)
    })
}

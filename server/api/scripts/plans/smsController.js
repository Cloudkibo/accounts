const PlansModel = require('../../v1/plans/plans.model')
const { smsPlans } = require('./data')

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

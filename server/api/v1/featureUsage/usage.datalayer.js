const PlanUsageModel = require('./planUsage.model')
const logicLayer = require('./usage.controller')
const CompanyUsageModel = require('./companyUsage.model')
const Plans = require('./../plans/plans.model')
const CompanyProfile = require('./../companyprofile/companyprofile.model')

exports.findOnePostObject = (usageId) => {
  return PlanUsageModel.findOne({_id: usageId})
    .populate('planId')
    .exec()
}

exports.findAllPlanUsageObjects = (query) => {
  return PlanUsageModel.find(query)
    .exec()
}

exports.findAllCompanyUsageObjects = (query) => {
  return CompanyUsageModel.find(query)
    .exec()
}

exports.genericUpdateCUsageObject = (query, updated, options) => {
  return CompanyUsageModel.update(query, updated, options)
    .exec()
}

exports.createPlanUsage = (aggregateObject) => {
  return PlanUsageModel.aggregate(aggregateObject).then()
}
exports.createCompanyUsage = (payload) => {
  let obj = new CompanyUsageModel(payload)
  return obj.save()
}
exports.updateUsage = (usageId, body) => {
  return PlanUsageModel.updateOne({_id: usageId}, body)
    .exec()
}

exports.populatePlan = () => {
  return new Promise((resolve, reject) => {
    Plans.find({}, (err, plans) => {
      if (err) {
        reject(err)
      }
      plans.forEach((plan, index) => {
        if (plan.unique_ID === 'plan_A' || plan.unique_ID === 'plan_C') {
          let planUsageData = logicLayer.preparePaidPlanPayload(plan)
          let planUsage = new PlanUsageModel(planUsageData)
          planUsage.save((err) => {
            if (err) {
              reject(err)
            }
          })
        } else if (plan.unique_ID === 'plan_B' || plan.unique_ID === 'plan_D') {
          let planUsageData = logicLayer.prepareFreePlanPayload(plan)
          let planUsage = new PlanUsageModel(planUsageData)
          planUsage.save((err) => {
            if (err) {
              reject(err)
            }
          })
        }
        if (index === (plans.length - 1)) {
          resolve('Successfully updated!')
        }
      })
    })
  })
}
exports.populateCompany = () => {
  return new Promise((resolve, reject) => {
    CompanyProfile.find({}, (err, companies) => {
      if (err) {
        reject(err)
      }
      companies.forEach((company, index) => {
        let companyUsageData = logicLayer.prepareCompanyUsagePayload(company)
        let companyUsage = new CompanyUsageModel(companyUsageData)
        companyUsage.save((err) => {
          if (err) {
            reject(err)
          }
        })
        if (index === (companies.length - 1)) {
          resolve('Successfully updated!')
        }
      })
    })
  })
}

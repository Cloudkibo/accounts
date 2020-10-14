// const logger = require('../../../components/logger')
// const TAG = '/api/scripts/billingPricing/companyUsage.controller.js'
const async = require('async')
const CompanyModel = require('../../v1/companyprofile/companyprofile.model')
const CompanyUsageModel = require('../../v1/featureUsage/companyUsage.model')
const PlanUsageModel = require('../../v1/featureUsage/planUsage.model')
const PagesModel = require('../../v1/pages/Pages.model')

exports.connectedPages = function (req, res) {
  CompanyModel.aggregate([
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(companies => {
      if (companies.length > 0) {
        async.each(companies, function (company, cb) {
          PlanUsageModel.findOne({planId: company.planId}).exec()
            .then(planUsage => {
              CompanyUsageModel.findOne({companyId: company._id}).exec()
                .then(companyUsage => {
                  if (companyUsage['facebook_pages'] > planUsage['facebook_pages']) {
                    PagesModel.update({companyId: company._id}, {connected: false}, {multi: true}).exec()
                      .then(updated => {
                        return CompanyUsageModel.update({companyId: company._id}, {facebook_pages: 0}).exec()
                      })
                      .then(updated => cb())
                      .catch(err => cb(err))
                  } else {
                    cb()
                  }
                })
                .catch(err => cb(err))
            })
            .catch(err => cb(err))
        }, function (err) {
          if (err) {
            return res.status(500).json({status: 'failed', payload: `Failed to normalize connectedPages ${err}`})
          } else {
            return res.status(200).json({status: 'success', description: 'Normalized successfully!'})
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

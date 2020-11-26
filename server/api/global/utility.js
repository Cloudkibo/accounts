const compose = require('composable-middleware')
const CompanyUserDataLayer = require('./../v1/companyuser/companyuser.datalayer')
const UserDataLayer = require('./../v1/user/user.datalayer')

const attachBuyerInfo = function () {
  return compose().use((req, res, next) => {
    CompanyUserDataLayer.findOneCompanyUserObjectUsingQueryPoppulate({companyId: req.actingAsUser ? req.actingAsUser.companyId : req.user.companyId, role: 'buyer'})
      .then(buyerInfo => {
        if (!buyerInfo) {
          return res.status(404).json({
            status: 'failed',
            description: 'The buyer account has some technical problems. Please contact support'
          })
        }
        return UserDataLayer.findOneUserObjectUsingQuery({domain_email: buyerInfo.domain_email})
      })
      .then(buyerInfo => {
        if (!buyerInfo) {
          return res.status(404).json({
            status: 'failed',
            description: 'The buyer account has some technical problems. Please contact support'
          })
        }
        req.user.buyerInfo = buyerInfo
        next()
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch buyer account ${JSON.stringify(error)}`
        })
      })
  })
}

exports.attachBuyerInfo = attachBuyerInfo

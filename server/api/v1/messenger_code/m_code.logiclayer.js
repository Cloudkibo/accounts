/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const UserDataLayer = require('./../user/user.datalayer')
const CompanyUserDataLayer = require('./../companyuser/companyuser.datalayer')
const CompanyProfileDataLayer = require('./../companyprofile/companyprofile.datalayer')
const logger = require('./../../../components/logger')

const TAG = 'server/v1/api/messenger_code/m_code.logiclayer.js'

const util = require('util')

exports.findCompanyFromUser = (user) => {
  return new Promise((resolve, reject) => {
    CompanyUserDataLayer.findOneCompanyUserObjectUsingQuery(user.domain_email)
      .then(companyUser => {
        if (companyUser) {
          return CompanyProfileDataLayer.findOneCompanyProfileObject(companyUser.companyId)
        } else { reject(new Error('Company User Not Found')) }
      })
      .then(companyProfile => {
        if (companyProfile) { resolve(companyProfile) } else {
          reject(new Error('Company Profile Not Found'))
        }
      })
      .catch(err => {
        logger.serverLog(TAG, `error found at findCompanyFromUser ${util.inspect(err)}`)
        reject(err)
      })
  })
}

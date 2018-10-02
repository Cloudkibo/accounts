/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const CompanyUserModel = require('./companyuser.model')

exports.findOneCompanyUserObjectUsingQuery = (queryObject) => {
  return CompanyUserModel.findOne(queryObject)
    .exec()
}

/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const CompanyPreferencesModel = require('./companypreferences.model')


exports.findAllCompanyPreferencesUsingQuery = (queryObject) => {
  return CompanyPreferencesModel.find(queryObject)
    .populate('comapanyId')
    .exec()
}

exports.findOneCompanyPreferencesUsingQuery = (queryObject) => {
  return CompanyPreferencesModel.findOne(queryObject)
    .populate('comapanyId')
    .exec()
}

exports.createCompanyPreferencesObject = (payload) => {
  let obj = new CompanyPreferencesModel(payload)
  return obj.save()
}

exports.findOneCompanyPreferencesAndUpdate = (query, update, options) => {
  return CompanyPreferencesModel.findOneAndUpdate(query, update, options)
    .exec()
}

exports.deleteCompanyPreferencesObject = (preferencesId) => {
  return CompanyPreferencesModel.deleteOne({_id: preferencesId})
    .exec()
}

exports.genericUpdateCompanyPreferencesObject = (query, updated, options) => {
  return CompanyPreferencesModel.update(query, updated, options)
    .exec()
}

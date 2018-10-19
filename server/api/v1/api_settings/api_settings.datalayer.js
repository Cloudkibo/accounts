/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const ApiSettingsModel = require('./api_settings.model')

exports.findOneApiObject = (query) => {
  return ApiSettingsModel.findOne(query)
    .exec()
}

exports.createApiObject = (payload) => {
  let obj = new ApiSettingsModel(payload)
  return obj.save()
}

exports.UpdateOneApiObject = (query, updated, options) => {
  return ApiSettingsModel.findByIdAndUpdate(query, updated, options)
    .exec()
}
exports.findAllUsingQuery = (queryObject) => {
  return ApiSettingsModel.find(queryObject)
    .populate('pageId userId companyId')
    .exec()
}

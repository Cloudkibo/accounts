const IntegrationUsageModel = require('./integrationUsage.model')

exports.createIntegrationUsageObject = (payload) => {
  let obj = new IntegrationUsageModel(payload)
  return obj.save()
}
exports.findIntegrationUsageObjects = (query) => {
  return IntegrationUsageModel.find(query)
    .populate('integrationId companyId')
    .exec()
}
exports.genericUpdate = (query, updated, options) => {
  return IntegrationUsageModel.update(query, updated, options)
    .exec()
}
exports.deleteIntegrationUsageObject = (id) => {
  return IntegrationUsageModel.deleteOne({_id: id})
    .exec()
}

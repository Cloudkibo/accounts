const IntegrationModel = require('./integrations.model')

exports.createIntegrationObject = (payload) => {
  let obj = new IntegrationModel(payload)
  return obj.save()
}
exports.findIntegrationObjects = (query) => {
  return IntegrationModel.find(query)
    .populate('companyId userId')
    .exec()
}
exports.genericUpdate = (query, updated, options) => {
  return IntegrationModel.update(query, updated, options)
    .exec()
}
exports.deleteIntegrationObject = (id) => {
  return IntegrationModel.deleteOne({_id: id})
    .exec()
}

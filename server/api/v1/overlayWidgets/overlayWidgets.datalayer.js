const OverlayWidgetsModel = require('./overlayWidgets.model')

exports.create = (payload) => {
  let obj = new OverlayWidgetsModel(payload)
  return obj.save()
}
exports.find = (query) => {
  return OverlayWidgetsModel.find(query)
    .exec()
}
exports.genericUpdate = (query, updated, options) => {
  return OverlayWidgetsModel.update(query, updated, options)
    .exec()
}
exports.delete = (id) => {
  return OverlayWidgetsModel.deleteOne({_id: id})
    .exec()
}
exports.aggregate = (query) => {
  return OverlayWidgetsModel.aggregate(query)
    .exec()
}

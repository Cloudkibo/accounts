const MessengerComponent = require('./messenger_components.model')

exports.createComponentObject = (payload) => {
  let obj = new MessengerComponent(payload)
  return obj.save()
}
exports.findComponentsObjects = (query) => {
  return MessengerComponent.find(query)
    .exec()
}
exports.aggregateInfo = (query) => {
  return MessengerComponent.aggregate(query)
    .exec()
}
exports.genericUpdate = (query, updated, options) => {
  return MessengerComponent.update(query, updated, options)
    .exec()
}
exports.deleteMany = (query) => {
  return MessengerComponent.deleteMany(query)
    .exec()
}

const ContactModel = require('./whatsAppContacts.model')

exports.createContactObject = (payload) => {
  let obj = new ContactModel(payload)
  return obj.save()
}
exports.findContactObjects = (query) => {
  return ContactModel.find(query)
    .exec()
}
exports.aggregateInfo = (query) => {
  return ContactModel.aggregate(query)
    .exec()
}
exports.genericUpdate = (query, updated, options) => {
  return ContactModel.update(query, updated, options)
    .exec()
}

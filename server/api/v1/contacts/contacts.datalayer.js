const ContactModel = require('./contacts.model')

exports.createContactObject = (payload) => {
  let obj = new ContactModel(payload)
  return obj.save()
}
exports.findContactObjects = (query) => {
  return ContactModel.find(query)
    .exec()
}

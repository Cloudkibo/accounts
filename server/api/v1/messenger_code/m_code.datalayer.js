const MessengerCodeModel = require('./messengerCode.model')

exports.createMessengerCode = (body) => {
  let obj = new MessengerCodeModel(body)
  return obj.save()
}

exports.findMessengerCode = (query) => {
  return MessengerCodeModel.find(query)
    .populate('companyId pageId')
    .exec()
}

exports.updateMessengerCode = (id, payload) => {
  return MessengerCodeModel.updateOne({pageId: id}, payload)
    .exec()
}

exports.deleteMessengerCode = (id) => {
  return MessengerCodeModel.deleteOne({_id: id})
    .exec()
}

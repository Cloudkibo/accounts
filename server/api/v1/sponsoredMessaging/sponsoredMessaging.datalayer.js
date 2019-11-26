const sponsoredMessagingModel = require('./sponsoredMessaging.model')

exports.createSponsoredMessage = (body) => {
    let obj = new sponsoredMessagingModel(body)
    return obj.save()
}


exports.updateSponsoredMessage = (id,body) => {
    return sponsoredMessagingModel.updateOne({_id:id},body)
    .exec()
}

exports.findSponsoredMessage = (query) => {
    return sponsoredMessagingModel.find(query)
    .exec()
}

exports.deleteSponsoredMessage = (sponsoredMessageId) => {
    return sponsoredMessagingModel.deleteOne({_id: sponsoredMessageId})
      .exec()
  }

exports.updateAllSponsoredMessage = (body) => {
  let query = body.match
  let updated = body.updated
  let options = {}
  return sponsoredMessagingModel.updateMany(query, updated, options)
}

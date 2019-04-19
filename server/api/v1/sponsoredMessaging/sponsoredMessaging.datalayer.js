const sponsoredMessagingModel = require('./sponsoredMessaging.model')

exports.createSponsoredMessage = (body) => {
    let obj = new sponsoredMessagingModel(body)
    return obj.save()
}


exports.updateSponsoredMessage = (id,body) => {
    return sponsoredMessagingModel.updateOne({_id:id},body)
    .exec()
}

exports.findSponsoredMessage = (id) => {
    return sponsoredMessagingModel.findOne({_id:id})
    .exec()
}

exports.deleteSponsoredMessage = (sponsoredMessageId) => {
    return sponsoredMessagingModel.deleteOne({_id: sponsoredMessageId})
      .exec()
  }

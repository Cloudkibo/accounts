const sponsoredMessagingModel = require('./sponsoredMessaging.model')

exports.createSponsoredMessage = (body) => {
    let obj = new sponsoredMessagingModel(body)
    return obj.save()
}
const PageModel = require('../../v1/subscribers/Subscribers.model')

exports.setSourceOfSubscribersToChatPlugin = function (req, res) {
  PageModel.update({messagesCount: 0}, {source: 'chat_plugin'}, {multi: true}).exec()
    .then(updated => {
      return res.status(200).json({status: 'success', payload: 'Updated successfully for subscribers source!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to update subscribers source ${err}`})
    })
}

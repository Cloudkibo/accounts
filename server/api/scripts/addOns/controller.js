const AddOnsModel = require('../../v1/addOns/addOns.model')

const { smsAddOns } = require('./data')

exports.populateAddOns = function (req, res) {
  const shopifyChatbot = new AddOnsModel(smsAddOns.shopifyChatbot)
  const manualChatbot = new AddOnsModel(smsAddOns.manualChatbot)

  Promise.all([shopifyChatbot.save(), manualChatbot.save()])
    .then(result => {
      return res.status(200).json({status: 'success', description: 'Populated successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', description: err})
    })
}

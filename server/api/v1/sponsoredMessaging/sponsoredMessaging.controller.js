const logger = require('../../../components/logger')
const dataLayer = require('./sponsoredMessaging.datalayer')

exports.create = function (req, res) {
  console.log('req.body', req.body)

  dataLayer.createSponsoredMessage(req.body)
    .then(result => {
      console.log('result', result)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

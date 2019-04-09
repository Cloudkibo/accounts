const dataLayer = require('./whatsAppContacts.datalayer')
const logicLayer = require('./whatsAppContacts.logiclayer')

exports.create = function (req, res) {
  dataLayer.createContactObject(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
exports.query = function (req, res) {
  dataLayer.findContactObjects(req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
exports.aggregate = function (req, res) {
  let query = logicLayer.validateAndConvert(req.body)
  dataLayer.aggregateInfo(query)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
exports.genericUpdate = function (req, res) {
  dataLayer.genericUpdate(req.body.query, req.body.newPayload, req.body.options)
    .then(result => {
      return res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: err})
    })
}

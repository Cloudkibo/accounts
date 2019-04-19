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


exports.update = function (req, res) {
  console.log('req.body', req.body)

  dataLayer.updateSponsoredMessage(req.body._id,req.body)
    .then(result => {
      console.log('result', result)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.findSponsoredMessage = function(req, res){
  let id = req.params.id
  console.log('id here',id)

    dataLayer.findSponsoredMessage(id)
    .then(sponsoredMessage => {
      console.log('spons', sponsoredMessage)
      return res.status(201).json({status:'success', payload: sponsoredMessage})
    })
    .catch(error => {
      return res.status(500).json({status:'failed', payload: `Couldn't fetch sponsored Messgae ${JSON.stringify(error)}`})
    })
}
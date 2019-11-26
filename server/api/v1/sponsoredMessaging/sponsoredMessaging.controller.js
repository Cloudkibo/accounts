const logger = require('../../../components/logger')
const dataLayer = require('./sponsoredMessaging.datalayer')
const SponsoredMessage = '/api/v1/sponsoredMessaging/sponsoredMessaging.controller.js'

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

  dataLayer.updateSponsoredMessage(req.params.id,req.body)
    .then(result => {
      console.log('result', result)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(SponsoredMessage, 'Hit the delete Sponsored Messaging endpoint')

  dataLayer.deleteSponsoredMessage(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      logger.serverLog(SponsoredMessage, `Error at delete sponsored message ${util.inspect(err)}`)
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.getAllSponsoredMessages = function (req, res) {
  let query = req.body
  console.log('query', query)
  dataLayer.findSponsoredMessage(query)
    .then(sponsoredMessages => {
      if (sponsoredMessages.length > 0) {
        console.log('result', sponsoredMessages)
        res.status(200).json({status: 'success', payload: sponsoredMessages})
      } else {
        res.status(200).json({status: 'success', payload: []})
      }
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Couldn't fetch sponsored Messges ${JSON.stringify(error)}`})
    })
}

exports.clickCountUpdate = function (req, res) {
  console.log('click count update', req.body)
  dataLayer.updateAllSponsoredMessage(req.body)
    .then(foundObjects => {
      res.status(200).json({status: 'success', payload: []})
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Couldn't update sponsorMessages ${JSON.stringify(error)}`})
    })
}

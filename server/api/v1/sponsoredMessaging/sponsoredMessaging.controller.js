const logger = require('../../../components/logger')
//const dataLayer = require('./landingPage.datalayer')
//const dataLayerState = require('./landingPageState.datalayer')
//const landingPageStateDataLayer = require('./landingPageState.datalayer')
//const TAG = '/api/v1/landingPage/landingPage.controller.js'

exports.create = function (req, res) {
  //logger.serverLog(TAG, 'Hit the create landing page controller', req.body)
  console.log('req.body', req.body)
  res.status(200).json({status: 'success', payload: req.body})

//   dataLayer.createLandingPage(req.body)
//     .then(result => {
//       console.log('result', result)
//       res.status(200).json({status: 'success', payload: result})
//     })
//     .catch(err => {
//       res.status(500).json({status: 'failed', payload: err})
//     })
}

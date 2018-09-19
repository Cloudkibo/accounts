const logger = require('../../../components/logger')
const logicLayer = require('./test.logiclayer')
const dataLayer = require('./test.datalayer')
const TAG = '/api/v1/test/index.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Hit the test index')
  let afterLogic = logicLayer.appendTestMessageToName(req.query.name)
  dataLayer.saveTestDocument(afterLogic)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
}

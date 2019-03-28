const PageModel = require('../../v1/pages/Pages.model')

exports.changeBroadcastApiLimit = function (req, res) {
  let limit = req.body.limit
  PageModel.update({}, {subscriberLimitForBatchAPI: limit}, {multi: true}).exec()
    .then(updated => {
      return res.status(200).json({status: 'success', payload: 'Updated successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to update pages ${err}`})
    })
}

exports.changeBroadcastApiLimitForOnePage = function (req, res) {
  let limit = req.body.limit
  PageModel.update({pageId: req.params.id}, {subscriberLimitForBatchAPI: limit}, {multi: true}).exec()
    .then(updated => {
      return res.status(200).json({status: 'success', payload: 'Updated successfully!'})
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to update pages ${err}`})
    })
}

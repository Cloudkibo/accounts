const IpCountryDataLayer = require('./ipcountry.datalayer')
const { sendErrorResponse, sendSuccessResponse } = require('../../global/response')

exports.findIp = function (req, res) {
  let ip = req.body.ip
  let ip2number = req.body.ip2number
  IpCountryDataLayer.findOneIpCountryObjectUsingQuery({ startipint: { $lte: ip2number }, endipint: { $gte: ip2number } })
    .then(gotLocation => {
      let response = {
        ip: ip
      }
      if (!gotLocation) {
        response.ccode = 'n/a'
        response.country = 'n/a'
      } else {
        response.ccode = gotLocation.ccode
        response.country = gotLocation.country
      }
      sendSuccessResponse(res, 200, response)
    })
    .catch(err => {
      sendErrorResponse(res, 500, '', 'Internal Server Error ' + JSON.stringify(err))
    })
}

const { genericUpdateCUsageObject } = require('../v1/featureUsage/usage.datalayer')
const TAG = 'api/global/billingPricing.js'
const logger = require('../../components/logger')

exports.updateCompanyUsage = function (companyId, feature, increment) {
  const updatedData = {}
  updatedData[feature] = increment
  genericUpdateCUsageObject(
    {companyId},
    {$inc: updatedData},
    {}
  )
    .then(updated => {
      logger.serverLog(TAG, `${feature} usage updated successfully for ${companyId}`, 'debug')
    })
    .catch(err => {
      logger.serverLog(TAG, `Failed to update ${feature} usage for ${companyId}`, 'error')
      logger.serverLog(TAG, err, 'error')
    })
}

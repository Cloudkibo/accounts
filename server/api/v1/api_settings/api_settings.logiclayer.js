/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
let crypto = require('crypto')

exports.getSettingsPayload = (companyId) => {
  let uid = crypto.randomBytes(10).toString('hex')
  let pwd = crypto.randomBytes(18).toString('hex')
  return {
    company_id: companyId,
    enabled: true,
    app_id: uid,
    app_secret: pwd
  }
}

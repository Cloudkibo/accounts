/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const PhoneModel = require('./Phone.model')

exports.findOnePhoneObject = (phoneId) => {
  return PhoneModel.findOne({_id: phoneId})
    .exec()
}

exports.findPhoneObjects = (query) => {
  return PhoneModel.find(query)
    .exec()
}

exports.createPhoneObject = (payload) => {
  let obj = new PhoneModel(payload)
  return obj.save()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL 
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updatePhoneObject = (phoneId, payload) => {
  return PhoneModel.updateOne({_id: phoneId}, payload)
    .exec()
}

exports.deletePhoneObject = (phoneId) => {
  return PhoneModel.deleteOne({_id: phoneId})
    .exec()
}

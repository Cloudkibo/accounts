/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const MenuModel = require('./Menu.model')

exports.findOneMenuObject = (menuId) => {
  return MenuModel.findOne({_id: menuId})
    .exec()
}

exports.findMenuObjects = (query) => {
  return MenuModel.find(query)
    .exec()
}

exports.aggregateInfo = (query) => {
  return MenuModel.aggregate(query)
    .exec()
}

exports.createMenuObject = (payload) => {
  let obj = new MenuModel(payload)
  return obj.save()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL 
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updateMenuObject = (menuId, payload) => {
  return MenuModel.updateOne({_id: menuId}, payload)
    .exec()
}

exports.deleteMenuObject = (menuId) => {
  return MenuModel.deleteOne({_id: menuId})
    .exec()
}

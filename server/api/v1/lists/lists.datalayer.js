/*
This file will contain the functions for data layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const ListModel = require('./Lists.model')

exports.findOneListObject = (listId) => {
  return ListModel.findOne({_id: listId})
    .exec()
}

exports.findListObjects = (query) => {
  return ListModel.find(query)
    .exec()
}

exports.aggregateInfo = (query) => {
  return ListModel.aggregate(query)
    .exec()
}

exports.createListObject = (listName, userId, companyId, content, conditions,
  initialList, parentList, parentListName) => {
  let payload = { listName,
    userId,
    companyId,
    content,
    conditions,
    initialList,
    parentList,
    parentListName }

  let obj = new ListModel(payload)
  return obj.save()
}

// DO NOT CHANGE: THIS FUNCTION IS BEING USED IN SEVERAL
// CONTROLLERS FOR UPDATING USER OBJECT
exports.updateListObject = (listId, payload) => {
  return ListModel.updateOne({_id: listId}, payload)
    .exec()
}

exports.genericUpdateListObject = (query, updated, options) => {
  return ListModel.update(query, updated, options)
    .exec()
}

exports.deleteListObject = (listId) => {
  return ListModel.deleteOne({_id: listId})
    .exec()
}

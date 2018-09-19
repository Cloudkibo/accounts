/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const TestModel = require('./test.model')

exports.saveTestDocument = (name) => {
  return TestModel.create({name: name})
}

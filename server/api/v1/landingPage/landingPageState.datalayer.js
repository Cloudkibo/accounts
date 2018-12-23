const LandingPageStateModel = require('./landingPageState.model')

exports.createLandingPageState = (body) => {
  let obj = new LandingPageStateModel(body)
  return obj.save()
}

exports.updateLandingPageState = (id, payload) => {
  return LandingPageStateModel.updateOne({_id: id}, payload)
    .exec()
}

exports.deleteLandingPageState = (id) => {
  return LandingPageStateModel.deleteOne({_id: id})
    .exec()
}
exports.findOneLandingPageState = (id) => {
  return LandingPageStateModel.findOne({_id: id})
    .exec()
}

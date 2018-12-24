const LandingPageModel = require('./landingPage.model')

exports.createLandingPage = (body) => {
  let obj = new LandingPageModel(body)
  return obj.save()
}

exports.findLandingPages = (query) => {
  return LandingPageModel.find(query)
    .populate('companyId pageId initialState')
    .exec()
}

exports.updateLandingPage = (id, payload) => {
  return LandingPageModel.updateOne({_id: id}, payload)
    .exec()
}

exports.deleteLandingPage = (id) => {
  return LandingPageModel.deleteOne({_id: id})
    .exec()
}

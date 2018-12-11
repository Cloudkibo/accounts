const LandingPageModel = require('./landingPage.model')

exports.createLandingPage = (body) => {
  let payload = {
    companyId: body.companyId,
    pageId: body.pageId,
    initialState: body.initialState,
    submittedState: body.submittedState,
    optInMessage: body.optInMessage,
    url: body.url
  }

  let obj = new LandingPageModel(payload)
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

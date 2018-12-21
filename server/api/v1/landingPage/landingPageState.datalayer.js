const LandingPageStateModel = require('./landingPageState.model')

exports.createLandingPageState = (body) => {
  // let payload = {
  //   title: body.title,
  //   description: body.description,
  //   pageTemplate: body.pageTemplate,
  //   backgroundColor: body.backgroundColor,
  //   titleColor: body.titleColor,
  //   descriptionColor: body.descriptionColor,
  //   buttonText: body.buttonText,
  //   mediaType: body.mediaType,
  //   mediaLink: body.mediaLink,
  //   mediaPlacement: body.mediaPlacement
  // }

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

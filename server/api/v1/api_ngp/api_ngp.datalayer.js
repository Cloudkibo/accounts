const ApiNGP = require('./api_ngp.model')

exports.findOneApiObject = (query) => {
  return ApiNGP.findOne(query)
    .exec()
}

exports.save_ngp = (query) => {
  let newSettings = new ApiNGP(query)
  return newSettings.save()
}

exports.update_ngp = (query, updated) => {

  return ApiNGP.findByIdAndUpdate(query, updated)
    .exec()
}
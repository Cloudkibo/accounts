const PageReferralModel = require('./pageReferrals.model')

exports.createPageReferral = (body) => {
  let obj = new PageReferralModel(body)
  return obj.save()
}

exports.findPageReferrals = (query) => {
  return PageReferralModel.find(query)
    .populate('companyId')
    .exec()
}

exports.updatePageReferral = (id, payload) => {
  return PageReferralModel.updateOne({_id: id}, payload)
    .exec()
}

exports.deletePageReferral = (id) => {
  return PageReferralModel.deleteOne({_id: id})
    .exec()
}

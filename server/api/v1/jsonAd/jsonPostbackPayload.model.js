let mongoose = require('mongoose')
let Schema = mongoose.Schema

let jsonPostbackPayload = new Schema({
  postbackPayloadId: {type: String, ref: 'pages'},
  responseMessage: [{type: Object}]
})

module.exports = mongoose.model('jsonPostbackPayload', jsonPostbackPayload)

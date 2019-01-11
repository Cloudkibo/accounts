let mongoose = require('mongoose')
let Schema = mongoose.Schema

let jsonAdMessages = new Schema({
  jsonAdId: {type: Schema.ObjectId, ref: 'jsonAd'},
  jsonAdMessageParentId: {type: String},
  messageContent: {type: Schema.Types.Mixed}
})

module.exports = mongoose.model('jsonAdMessages', jsonAdMessages)

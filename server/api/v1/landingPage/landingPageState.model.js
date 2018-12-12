let mongoose = require('mongoose')
let Schema = mongoose.Schema

const landingPageStateSchema = new Schema({
  title: {type: String},
  description: {type: String},
  pageTemplate: {type: String},
  backgroundColor: {type: String},
  titleColor: {type: String},
  descriptionColor: {type: String},
  buttonText: {type: String},
  mediaType: {type: String},
  mediaLink: {type: String},
  mediaPlacement: {type: String}
})

module.exports = mongoose.model('landingPageStates', landingPageStateSchema)

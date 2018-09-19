let mongoose = require('mongoose')
let Schema = mongoose.Schema

let testSchema = new Schema({
  name: String,
  createtime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('test', testSchema)

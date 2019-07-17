let mongoose = require('mongoose')
let Schema = mongoose.Schema

const customFieldSubscibersSchema = new Schema({
  customFieldId: { type: Schema.ObjectId, ref: 'custom_fields' },
  subscriberId: { type: Schema.ObjectId, ref: 'subscribers' },
  value: { type: String }
})

module.exports = mongoose.model('custom_field_subscribers', customFieldSubscibersSchema)

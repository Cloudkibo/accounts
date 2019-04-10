let mongoose = require('mongoose')
let Schema = mongoose.Schema

let sponsoredMessagesSchema = new Schema({
    payload: Schema.Types.Mixed,
    message_creative_id: String,
    ad_set_payload: Schema.Types.Mixed,
    targeting: { longitude: Number, latitude: Number},
    ad_id: String,
    campaign_name: String,
    campaign_id: String,
    status: String,
    companyId: { type: Schema.ObjectId, ref: 'companyprofile' },
    userId: { type: Schema.ObjectId, ref: 'users' },
    pageId: { type: Schema.ObjectId, ref: 'pages'},
    statsFromUs: Schema.Types.Mixed
})

module.exports = mongoose.model('sponsoredMessages', sponsoredMessagesSchema)
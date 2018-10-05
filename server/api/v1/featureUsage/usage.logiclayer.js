exports.prepareUpdateUsagePayload = (body) => {
  let temp = {}
  temp[body.item_name] = body.item_value
  return temp
}
exports.preparePaidPlanPayload = (plan) => {
  let planUsageData = {
    planId: plan._id,
    broadcasts: -1,
    surveys: -1,
    polls: -1,
    broadcast_templates: -1,
    survey_templates: -1,
    polls_templates: -1,
    sessions: -1,
    chat_messages: -1,
    facebook_pages: -1,
    bots: -1,
    subscribers: -1,
    labels: -1,
    phone_invitation: -1,
    facebook_autoposting: -1,
    twitter_autoposting: -1,
    wordpress_autoposting: -1,
    broadcast_sequences: -1,
    messages_per_sequence: -1,
    segmentation_lists: -1
  }
  return planUsageData
}
exports.prepareFreePlanPayload = (plan) => {
  let planUsageData = {
    planId: plan._id,
    broadcasts: -1,
    surveys: -1,
    polls: -1,
    broadcast_templates: 0,
    survey_templates: 0,
    polls_templates: 0,
    sessions: -1,
    chat_messages: -1,
    facebook_pages: 5,
    bots: -1,
    subscribers: 1000,
    labels: 10,
    phone_invitation: 0,
    facebook_autoposting: 2,
    twitter_autoposting: 2,
    wordpress_autoposting: 2,
    broadcast_sequences: 3,
    messages_per_sequence: 5,
    segmentation_lists: 5
  }
  return planUsageData
}
exports.prepareCompanyUsagePayload = (company) => {
  let companyUsageData = {
    companyId: company._id,
    broadcasts: 0,
    surveys: 0,
    polls: 0,
    broadcast_templates: 0,
    survey_templates: 0,
    polls_templates: 0,
    sessions: 0,
    chat_messages: 0,
    facebook_pages: 0,
    bots: 0,
    subscribers: 0,
    labels: 0,
    phone_invitation: 0,
    facebook_autoposting: 0,
    twitter_autoposting: 0,
    wordpress_autoposting: 0,
    broadcast_sequences: 0,
    messages_per_sequence: 0,
    segmentation_lists: 0
  }
  return companyUsageData
}

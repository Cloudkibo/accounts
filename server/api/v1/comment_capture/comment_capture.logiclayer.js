/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

exports.preparePostPayload = (body) => {
  return {
    pageId: body.pageId,
    companyId: body.companyId,
    userId: body.userId,
    payload: body.payload,
    reply: body.reply,
    includedKeywords: body.includedKeywords,
    excludedKeywords: body.excludedKeywords
  }
}

exports.prepareUpdatePostPayload = (body) => {
  let temp = {}
  if (body.includedKeywords) temp.includedKeywords = body.includedKeywords
  if (body.excludedKeywords) temp.excludedKeywords = body.excludedKeywords
  return temp
}

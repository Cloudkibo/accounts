/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

exports.prepareUpdateUserPayload = (body) => {
  let temp = {}

  if (body.name) temp.name = body.name
  if (body.description) temp.description = body.description
  if (body.teamPages) temp.teamPages = body.teamPages
  if (body.teamPagesIds) temp.teamPagesIds = body.teamPagesIds

  return temp
}

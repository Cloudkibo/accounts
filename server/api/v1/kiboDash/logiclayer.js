exports.mapData = (data, broadcastAggregates, pollsAggregate, surveysAggregate) => {
  data = data.map((page) => {
    broadcastAggregates.forEach((broadcast) => {
      if (page.pageId.toString() === broadcast._id) {
        page.numberOfBroadcasts = broadcast.totalCount
      }
    })
    return page
  })
  // set Polls counts
  data = data.map((page) => {
    pollsAggregate.forEach((poll) => {
      if (page.pageId.toString() === poll._id) {
        page.numberOfPolls = poll.totalCount
      }
    })
    return page
  })
  // set Survey count
  data = data.map((page) => {
    surveysAggregate.forEach((survey) => {
      if (page.pageId.toString() === survey._id) {
        page.numberOfSurveys = survey.totalCount
      }
    })
    return page
  })
  return data
}

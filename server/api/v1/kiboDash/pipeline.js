exports.filterConnectedPages = { $match: { connected: true } }
exports.countResults = { $group: { _id: null, count: { $sum: 1 } } }
exports.joinPageWithSubscribers = {
  $lookup:
  {
    from: 'pages',
    localField: '_id',
    foreignField: '_id',
    as: 'page'
  }
}

exports.projectArrayElemAsPage = {
  $project:
  {
    _id: true,
    numberOfSubscribers: true,
    page: { $arrayElemAt: ['$page', 0] }
  }
}

exports.selectPageFields = {
  $project:
  {
    _id: true,
    pageName: '$page.pageName',
    pageId: '$page.pageId',
    pageUserName: '$page.pageUserName',
    likes: '$page.likes',
    numberOfSubscribers: true,
    numberOfBroadcasts: {'$literal': 0},
    numberOfPolls: {'$literal': 0},
    numberOfSurveys: {'$literal': 0}
  }
}

exports.groupByPageId = {
  $group: {
    _id: '$pageId',
    numberOfSubscribers: {$sum: 1}}
}

exports.companyWisePageCount = {
  $group: {
    _id: '$companyId',
    totalPages: { $sum: 1 }
  }
}

exports.joinCompanyWithSubscribers = {
  $lookup:
  {
    from: 'subscribers',
    localField: 'companyId',
    foreignField: 'companyId',
    as: 'companysubscribers'
  }
}
exports.filterCompanySubscribers = {
  $project: {
    companyId: true,
    userId: true,
    companysubscribers: {
      $filter: {
        input: '$companysubscribers',
        as: 'companysubscriber'
      }
    }
  }
}

exports.selectCompanyFields = {
  $project: {
    companyId: true,
    userId: true,
    numberOfSubscribers: { $size: '$companysubscribers' },
    numberOfBroadcasts: {
      $literal: 0
    },
    numberOfPolls: {
      $literal: 0
    },
    numberOfSurveys: {
      $literal: 0
    },
    numberOfPages: {
      $literal: 0
    },
    numberOfConnectedPages: {
      $literal: 0
    }
  }
}

exports.filterDate = {
  $match: {
  }
}
exports.filterUserDate = {
  $match: {
  }
}
exports.groupCompanyWiseAggregates = {
  $group: {
    _id: '$companyId',
    totalCount: { $sum: 1 }
  }
}

exports.pageWiseAggregate = {
  $group: {
    _id: '$pageId',
    totalCount: { $sum: 1 }
  }
}

exports.joinAutpostingMessages = {
  $lookup:
  {
    from: 'autoposting_messages',
    localField: '_id',
    foreignField: 'autopostingId',
    as: 'posts'
  }
}

exports.dateFilterAutoposting = function (ISODateString) {
  return {
    $project: {
      userId: true,
      companyId: true,
      subscriptionType: true,
      subscriptionUrl: true,
      posts: {
        $filter: {
          input: '$posts',
          as: 'posts',
          cond: { $gte: [ '$$posts.datetime', new Date(ISODateString) ] }
        }
      },
      totalAutopostingSent: { $size: '$posts' }
    }
  }
}

exports.selectAutoPostingFields = {
  $project: {
    userId: true,
    companyId: true,
    subscriptionType: true,
    subscriptionUrl: true,
    totalAutopostingSent: { $size: '$posts' }
  }
}

exports.selectTwitterType = { $match: { subscriptionType: 'twitter' } }

exports.selectFacebookType = { $match: { subscriptionType: 'facebook' } }

exports.selectWordpressType = { $match: { subscriptionType: 'wordpress' } }

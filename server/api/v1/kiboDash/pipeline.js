exports.filterConnectedPages = { $match: { connected: true } }
exports.countResults = { $group: { _id: null, count: { $sum: 1 } } }
exports.joinPageWithSubscribers = {
  $lookup:
  {
    from: 'subscribers',
    localField: '_id',
    foreignField: 'pageId',
    as: 'pageSubscribers'
  }
}

exports.filterPageSubscribers = {
  $project: {
    _id: true,
    pageName: true,
    pageId: true,
    pageSubscribers: {
      $filter: {
        input: '$pageSubscribers',
        as: 'pageSubscriber'
      }
    }
  }
}
exports.selectPageFields = {
  $project: {
    _id: true,
    pageName: true,
    pageId: true,
    pageUserName: true,
    likes: true,
    numberOfSubscribers: { $size: { '$ifNull': ['$pageSubscribers', []] } },
    numberOfBroadcasts: {
      $literal: 0
    },
    numberOfPolls: {
      $literal: 0
    },
    numberOfSurveys: {
      $literal: 0
    }
  }
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

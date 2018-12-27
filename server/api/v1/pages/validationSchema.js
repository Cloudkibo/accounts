/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.pagePayload = {
  type: 'object',
  properties: {
    pageId: {
      type: 'string',
      required: true
    },
    pageName: {
      type: 'string',
      required: true
    },
    pageUserName: {
      type: 'string',
      required: false
    },
    pagePic: {
      type: 'string',
      required: true
    },
    likes: {
      type: 'number',
      required: true
    },
    accessToken: {
      type: 'string',
      required: true
    },
    connected: {
      type: 'boolean',
      required: true
    },
    userId: {
      type: 'string',
      required: true
    },
    companyId: {
      type: 'string',
      required: true
    },
    greetingText: {
      type: 'string',
      required: false
    },
    welcomeMessage: {
      type: 'array',
      required: false
    },
    isWelcomeMessageEnabled: {
      type: 'boolean',
      required: false
    },
    gotPageSubscriptionPermission: {
      type: 'boolean',
      required: false
    }
  }
}

exports.pageUpdatePayload = {
  type: 'object',
  properties: {
    pagePic: {
      type: 'string',
      required: false
    },
    likes: {
      type: 'number',
      required: false
    },
    accessToken: {
      type: 'string',
      required: false
    },
    connected: {
      type: 'boolean',
      required: false
    },
    userId: {
      type: 'string',
      required: false
    },
    companyId: {
      type: 'string',
      required: false
    },
    greetingText: {
      type: 'string',
      required: false
    },
    welcomeMessage: {
      type: 'array',
      required: false
    },
    isWelcomeMessageEnabled: {
      type: 'boolean',
      required: false
    },
    gotPageSubscriptionPermission: {
      type: 'boolean',
      required: false
    }
  }
}

exports.updateGreetingText = {
  type: 'object',
  properties: {
    greetingText: {
      type: 'string',
      required: true
    }
  }
}

exports.genericUpdatePayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'query': {
      'type': 'object'
    },
    'newPayload': {
      'type': 'object'
    },
    'options': {
      'type': 'object'
    }
  },
  'required': [
    'query',
    'newPayload',
    'options'
  ]
}
exports.whiteListPayload = {
  type: 'object',
  properties: {
    page_id: {
      type: 'string',
      required: true
    },
    whitelistDomains: {
      type: 'array',
      items: {
        type: 'string'
      },
      required: true
    }
  }
}
exports.deleteWhitelistDomain = {
  type: 'object',
  properties: {
    page_id: {
      type: 'string',
      required: true
    },
    whitelistDomain: {
      type: 'string',
      required: true
    }
  }
}

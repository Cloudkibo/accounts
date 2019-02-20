/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.subscriberPayload = {
  type: 'object',
  properties: {
    pageScopedId: {
      type: 'string',
      required: false
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    locale: {
      type: 'string',
      required: true
    },
    timezone: {
      type: 'number',
      required: true
    },
    email: {
      type: 'string',
      required: false
    },
    gender: {
      type: 'string',
      required: true
    },
    senderId: {
      type: 'string',
      required: true
    },
    profilePic: {
      type: 'string',
      required: true
    },
    coverPhoto: {
      type: 'string',
      required: false
    },
    pageId: {
      type: 'string',
      required: true
    },
    phoneNumber: {
      type: 'string',
      required: false
    },
    unSubscribedBy: {
      type: 'string',
      required: false
    },
    source: {
      type: 'string',
      required: false
    },
    companyId: {
      type: 'string',
      required: true
    },
    isSubscribed: {
      type: 'boolean',
      required: false
    },
    isEnabledByPage: {
      type: 'boolean',
      required: false
    }
  }
}

exports.updateSubscriberPayload = {
  type: 'object',
  properties: {
    pageScopedId: {
      type: 'string',
      required: false
    },
    firstName: {
      type: 'string',
      required: false
    },
    lastName: {
      type: 'string',
      required: false
    },
    locale: {
      type: 'string',
      required: false
    },
    timezone: {
      type: 'number',
      required: false
    },
    email: {
      type: 'string',
      required: false
    },
    gender: {
      type: 'string',
      required: false
    },
    senderId: {
      type: 'string',
      required: false
    },
    profilePic: {
      type: 'string',
      required: false
    },
    coverPhoto: {
      type: 'string',
      required: false
    },
    pageId: {
      type: 'string',
      required: false
    },
    phoneNumber: {
      type: 'string',
      required: false
    },
    unSubscribedBy: {
      type: 'string',
      required: false
    },
    source: {
      type: 'string',
      required: false
    },
    companyId: {
      type: 'string',
      required: false
    },
    isSubscribed: {
      type: 'boolean',
      required: false
    },
    isEnabledByPage: {
      type: 'boolean',
      required: false
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

exports.queryPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'companyId': {
      'type': 'string'
    }
  }
}

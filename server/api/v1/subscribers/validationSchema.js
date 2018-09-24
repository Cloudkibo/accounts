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
      required: true
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
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true
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
      required: true
    },
    pageId: {
      type: 'string',
      required: true
    },
    phoneNumber: {
      type: 'string',
      required: true
    },
    unSubscribedBy: {
      type: 'string',
      required: false
    },
    source: {
      type: 'string',
      required: false
    },
    companyId:  {
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
    },
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
      type: 'string',
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
    companyId:  {
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
    },
  }
}


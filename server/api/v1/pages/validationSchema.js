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
      required: true
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
      type: 'string',
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
      type: 'object',
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
      type: 'string',
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
      type: 'object',
      required: false
    },
    isWelcomeMessageEnabled: {
      type: 'string',
      required: false
    },
    gotPageSubscriptionPermission: {
      type: 'string',
      required: false
    }
  }
}
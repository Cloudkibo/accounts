/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.postPayload = {
  type: 'object',
  properties: {
    pageId: {
      type: 'string',
      required: true
    },
    companyId: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'string',
      required: true
    },
    reply: {
      type: 'string',
      required: true
    },
    payload: {
      type: 'object'
    },
    includedKeywords: {
      type: 'string',
      required: true
    },
    excludedKeywords: {
      type: 'string',
      required: true
    }
  }
}

exports.updatePostPayload = {
  type: 'object',
  properties: {
    includedKeywords: {
      type: 'string',
      required: false
    },
    excludedKeywords: {
      type: 'string',
      required: false
    }
  }
}

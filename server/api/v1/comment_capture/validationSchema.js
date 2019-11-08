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
      type: 'array',
      required: false
    },
    includedKeywords: {
      type: 'array',
      items: {
        type: 'string',
        required: true
      }
    },
    excludedKeywords: {
      type: 'array',
      items: {
        type: 'string',
        required: true
      }
    },
    title: {
      type: 'string',
      required: true
    },
    existingPostUrl: {
      type: 'string',
      required: false
    }
  }
}

exports.updatePostPayload = {
  type: 'object',
  properties: {
    includedKeywords: {
      type: 'array',
      items: {
        type: 'string',
        required: false
      }
    },
    excludedKeywords: {
      type: 'array',
      items: {
        type: 'string',
        required: false
      }
    }
  }
}

exports.genericQueryPayload = {
  'type': 'object',
  'properties': {
    'type': {
      'type': 'string',
      'required': true
    },
    'query': {
      'type': 'object',
      'properties': {
        'pageId': {
          'type': 'string'
        },
        'companyId': {
          'type': 'string'
        },
        'userId': {
          'type': 'string'
        },
        'reply': {
          'type': 'string'
        },
        'payload': {
          'type': 'object'
        },
        'includedKeywords': {
          'type': 'array',
          'items': [
            {
              'type': 'string'
            }
          ]
        },
        'excludedKeywords': {
          'type': 'array',
          'items': [
            {
              'type': 'string'
            }
          ]
        }
      },
      'required': true
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

/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.indexPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'companyId': {
      'type': 'string'
    }
  },
  'required': [
    'companyId'
  ]
}

/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.phonePayload = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    },
    number: {
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
    hasSubscribed: {
      type: 'boolean',
      required: false
    },
    pageId: {
      type: 'string',
      required: true
    },
    pageIdFb: {
      type: 'string',
      required: false
    },
    fileName: {
      type: 'array',
      items: {
        type: 'string',
        required: true
      }
    }
  }
}

exports.updatedphonePayload = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: false
    },
    number: {
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
    hasSubscribed: {
      type: 'boolean',
      required: false
    },
    pageId: {
      type: 'string',
      required: false
    },
    pageIdFb: {
      type: 'string',
      required: false
    },
    fileName: {
      type: 'array',
      items: {
        type: 'string',
        required: false
      }
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

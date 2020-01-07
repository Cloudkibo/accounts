exports.createPayload = {
  type: 'object',
  properties: {
    companyId: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'string',
      required: true
    },
    widgetType: {
      type: 'string',
      required: true
    },
    pageId: {
      type: 'string',
      required: true
    },
    isActive: {
      type: 'boolean',
      required: true
    },
    initialState: {
      type: 'object',
      required: true
    },
    submittedState: {
      type: 'object',
      required: true
    },
    optInMessage: {
      type: 'array',
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

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
    integrationName: {
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

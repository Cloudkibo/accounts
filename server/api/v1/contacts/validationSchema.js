exports.create = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'companyId': {
      'type': 'string'
    },
    'number': {
      'type': 'string'
    }
  },
  'required': [
    'name',
    'companyId',
    'number'
  ]
}
exports.queryPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'companyId': {
      'type': 'string',
      'required': true
    }
  }
}

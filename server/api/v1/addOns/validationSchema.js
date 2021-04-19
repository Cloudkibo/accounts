exports.createPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'feature': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'price': {
      'type': 'string'
    },
    'currency': {
      'type': 'string'
    },
    'permissions': {
      'type': 'array',
      'items': [
        {
          'type': 'string'
        }
      ]
    },
    'others': {
      'type': 'object'
    },
    'platform': {
      'type': 'string'
    }
  },
  'required': [
    'feature',
    'description',
    'price',
    'currency',
    'permissions',
    'platform'
  ]
}

exports.queryPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'purpose': {
      'type': 'string',
      'required': true
    },
    'match': {
      'type': 'object',
      'required': true
    }
  }
}

exports.updatePayload =
{
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'purpose': {
      'type': 'string'
    },
    'match': {
      'type': 'object'
    },
    'updated': {
      'type': 'object'
    }
  },
  'required': [
    'purpose',
    'match',
    'updated'
  ]
}

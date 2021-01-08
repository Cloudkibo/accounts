/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/
// For express json validation
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
    }
  },
  'required': [
    'feature',
    'description',
    'price',
    'currency',
    'permissions'
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
      'type': 'object',
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

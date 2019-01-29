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
    'customFieldId': {
      'type': 'string'
    },
    'subscriberId': {
      'type': 'string'
    },
    'value': {
      'type': 'string'
    }
  },
  'required': [
    'customFieldId',
    'subscriberId',
    'value'
  ]
}

exports.queryPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'purpose': {
      'type': 'string'
    },
    'match': {
      'type': 'object',
      'properties': {
        '_id': {
          'type': 'string'
        },
        'customFieldId': {
          'type': 'string'
        },
        'subscriberId': {
          'type': 'string'
        },
        'value': {
          'type': 'string'
        }
      }
    }
  },
  'required': [
    'purpose',
    'match'
  ]
}

exports.updatePayload =
  {
    '$schema': 'http://json-schema.org/draft-04/schema#',
    'type': 'object',
    'properties': {
      'purpose': {
        'type': 'string'
      },
      'match': [
        {
          'type': 'object',
          'properties': {
            'customFieldId': {
              'type': 'string'
            },
            'subscriberId': {
              'type': 'string'
            },
            'value': {
              'type': 'string'
            }
          }
        }
      ],
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

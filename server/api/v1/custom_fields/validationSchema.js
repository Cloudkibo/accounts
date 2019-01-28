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
    'name': {
      'type': 'string'
    },
    'type': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'companyId': {
      'type': 'string'
    },
    'createdBy': {
      'type': 'string'
    },
    'createdDate': {
      'type': 'Date'
    }
  },
  'required': [
    'name',
    'type',
    'companyId',
    'createdBy'
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
          'type': 'ObjectId'
        },
        'name': {
          'type': 'string'
        },
        'type': {
          'type': 'string'
        },
        'description': {
          'type': 'string'
        },
        'companyId': {
          'type': 'string'
        },
        'createdBy': {
          'type': 'string'
        },
        'createdDate': {
          'type': 'date'
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
      'match': {
        'type': 'object',
        'properties': {
          '_id': {
            'type': 'ObjectId'
          },
          'name': {
            'type': 'string'
          },
          'type': {
            'type': 'string'
          },
          'description': {
            'type': 'string'
          },
          'companyId': {
            'type': 'string'
          },
          'createdBy': {
            'type': 'string'
          },
          'createdDate': {
            'type': 'date'
          }
        }
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

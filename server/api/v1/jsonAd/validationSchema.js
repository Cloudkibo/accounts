/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.create = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'jsonAdMessages': {
      'type': 'array',
      'items': {}
    }
  },
  'required': [
    'jsonAdMessages'
  ]
}

exports.edit = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'jsonAdId': {
      'type': 'string'
    },
    'jsonAdMessages': {
      'type': 'array',
      'items': {}
    }
  },
  'required': [
    'jsonAdId',
    'jsonAdMessages'
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

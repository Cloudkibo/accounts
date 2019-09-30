/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.createPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'companyId': {
      'type': 'string'
    },
    'pageId': {
      'type': 'string'
    },
    'QRCode': {
      'type': 'string'
    },
    'optInMessage': {
      'type': 'array'
    }
  },
  'required': [
    'companyId',
    'pageId',
    'QRCode',
    'optInMessage'

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
exports.updatePayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'optInMessage': {
      'type': 'array',
      'required': true
    }
  }
}

/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.create = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'companyId': {
      'type': 'string'
    },
    'platform': {
      'type': 'string'
    },
    'commercePlatform': {
      'type': 'string'
    },
    'subscriberId': {
      'type': 'string'
    },
    'phone': {
      'type': 'string'
    },
    'emailAddress': {
      'type': 'string'
    },
    'storeName': {
      'type': 'string'
    }
  },
  'required': [
    'companyId',
    'platform',
    'commercePlatform',
    'emailAddress',
    'storeName'
  ]
}

exports.verify = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'companyId': {
      'type': 'string'
    },
    'platform': {
      'type': 'string'
    },
    'commercePlatform': {
      'type': 'string'
    },
    'subscriberId': {
      'type': 'string'
    },
    'phone': {
      'type': 'string'
    },
    'emailAddress': {
      'type': 'string'
    },
    'otp': {
      'type': 'string'
    }
  },
  'required': [
    'companyId',
    'platform',
    'commercePlatform',
    'emailAddress',
    'otp'
  ]
}

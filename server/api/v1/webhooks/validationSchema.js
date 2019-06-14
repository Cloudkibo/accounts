/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.webhookPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'webhook_url': {
      'type': 'string'
    },
    'companyId': {
      'type': 'string'
    },
    'userId': {
      'type': 'string'
    },
    'isEnabled': {
      'type': 'boolean'
    },
    'optIn': {
      'type': 'object'
    },
    'pageId': {
      'type': 'string'
    }
  },
  'required': [
    'webhook_url',
    'companyId',
    'userId',
    'optIn',
    'pageId'
  ]
}

exports.updateWebhookPayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'webhook_url': {
      'type': 'string'
    },
    'isEnabled': {
      'type': 'boolean'
    },
    'optIn': {
      'type': 'object'
    }
  }
}

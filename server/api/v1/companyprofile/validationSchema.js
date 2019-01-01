/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.invitePayload = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string'
    },
    'name': {
      'type': 'string'
    },
    'role': {
      'type': 'string'
    }
  },
  'required': [
    'email',
    'name',
    'role'
  ]
}

exports.updateRole = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'domain_email': {
      'type': 'string'
    },
    'role': {
      'type': 'string'
    }
  },
  'required': [
    'domain_email',
    'role'
  ]
}

exports.removeMember = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'domain_email': {
      'type': 'string'
    }
  },
  'required': [
    'domain_email'
  ]
}

exports.updateAutomatedOptions = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'automated_options': {
      'type': 'object'
    }
  },
  'required': [
    'automated_options'
  ]
}

exports.setCard = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'stripeToken': {
      'type': 'string'
    },
    'companyId': {
      'type': 'string'
    }
  },
  'required': [
    'stripeToken',
    'companyId'
  ]
}

exports.updatePlan = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'plan': {
      'type': 'string'
    },
    'stripeToken': {
      'type': 'string'
    }
  },
  'required': [
    'plan',
    'stripeToken'
  ]
}

exports.genericQueryPayload = {
  'type': 'object',
  'properties': {
    'type': {
      'type': 'string'
    },
    'query': {
      'type': 'object',
      'properties': {
        'pageId': {
          'type': 'string'
        },
        'companyId': {
          'type': 'string'
        },
        'userId': {
          'type': 'string'
        },
        'reply': {
          'type': 'string'
        },
        'payload': {
          'type': 'object'
        },
        'includedKeywords': {
          'type': 'array',
          'items': [
            {
              'type': 'string'
            }
          ]
        },
        'excludedKeywords': {
          'type': 'array',
          'items': [
            {
              'type': 'string'
            }
          ]
        }
      }
    }
  },
  'required': [
    'type',
    'query'
  ]
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

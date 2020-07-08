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
    'userId': {
      'type': 'string'
    },
    'companyId': {
      'type': 'string'
    },
    'subscriberId': {
      'type': 'string'
    },
    'topic': {
      'type': 'string'
    },
    'agenda': {
      'type': 'string'
    },
    'invitationMessage': {
      'type': 'string'
    },
    'meetingUrl': {
      'type': 'string'
    }
  },
  'required': [
    'userId',
    'companyId',
    'subscriberId',
    'topic',
    'agenda',
    'invitationMessage',
    'meetingUrl'
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
      'properties': {
        'userId': {
          'type': 'string'
        },
        'companyId': {
          'type': 'string'
        },
        'subscriberId': {
          'type': 'string'
        },
        'topic': {
          'type': 'string'
        },
        'agenda': {
          'type': 'string'
        },
        'invitationMessage': {
          'type': 'string'
        },
        'meetingUrl': {
          'type': 'string'
        }
      },
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
      'properties': {
        'userId': {
          'type': 'string'
        },
        'companyId': {
          'type': 'string'
        },
        'subscriberId': {
          'type': 'string'
        },
        'topic': {
          'type': 'string'
        },
        'agenda': {
          'type': 'string'
        },
        'invitationMessage': {
          'type': 'string'
        },
        'meetingUrl': {
          'type': 'string'
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

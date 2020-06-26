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
    'zoomId': {
      'type': 'string'
    },
    'firstName': {
      'type': 'string'
    },
    'lastName': {
      'type': 'string'
    },
    'zoomRole': {
      'type': 'string'
    },
    'personalMeetingUrl': {
      'type': 'string'
    },
    'profilePic': {
      'type': 'string'
    },
    'language': {
      'type': 'string'
    },
    'phoneCountry': {
      'type': 'string'
    },
    'phoneNumber': {
      'type': 'string'
    },
    'accessToken': {
      'type': 'string'
    },
    'refreshToken': {
      'type': 'string'
    }
  },
  'required': [
    'userId',
    'companyId',
    'zoomId',
    'firstName',
    'lastName',
    'accessToken',
    'refreshToken'
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
        'zoomId': {
          'type': 'string'
        },
        'firstName': {
          'type': 'string'
        },
        'lastName': {
          'type': 'string'
        },
        'zoomRole': {
          'type': 'string'
        },
        'personalMeetingUrl': {
          'type': 'string'
        },
        'profilePic': {
          'type': 'string'
        },
        'language': {
          'type': 'string'
        },
        'phoneCountry': {
          'type': 'string'
        },
        'phoneNumber': {
          'type': 'string'
        },
        'accessToken': {
          'type': 'string'
        },
        'refreshToken': {
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
        'zoomId': {
          'type': 'string'
        },
        'firstName': {
          'type': 'string'
        },
        'lastName': {
          'type': 'string'
        },
        'zoomRole': {
          'type': 'string'
        },
        'personalMeetingUrl': {
          'type': 'string'
        },
        'profilePic': {
          'type': 'string'
        },
        'language': {
          'type': 'string'
        },
        'phoneCountry': {
          'type': 'string'
        },
        'phoneNumber': {
          'type': 'string'
        },
        'accessToken': {
          'type': 'string'
        },
        'refreshToken': {
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

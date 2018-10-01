/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.userPayload = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    domain: {
      type: 'string',
      required: false
    },
    uiMode: {
      type: 'string',
      required: false
    }
  }
}

exports.updateUserPayload = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: false
    },
    email: {
      type: 'string',
      required: false
    },
    uiMode: {
      type: 'string',
      required: false
    }
  }
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

exports.enableGDPRDelete = {
  type: 'object',
  properties: {
    delete_option: {
      type: 'string',
      required: true
    },
    deletion_date: {
      type: 'string',
      required: true
    }
  }
}

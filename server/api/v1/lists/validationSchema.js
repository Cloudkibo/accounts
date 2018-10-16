/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.listPayload = {
  type: 'object',
  properties: {
    listName: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'string',
      required: true
    },
    companyId: {
      type: 'string',
      required: true
    },
    content: {
      type: 'array',
      required: true
    },
    conditions: {
      type: 'array',
      required: true
    },
    initialList: {
      type: 'boolean',
      required: false
    },
    parentList: {
      type: 'string',
      required: false
    },
    parentListName: {
      type: 'string',
      required: false
    }
  }
}

exports.updateListPayload = {
  type: 'object',
  properties: {
    listName: {
      type: 'string',
      required: false
    },
    userId: {
      type: 'string',
      required: false
    },
    companyId: {
      type: 'string',
      required: false
    },
    content: {
      type: 'array',
      required: false
    },
    conditions: {
      type: 'array',
      required: false
    },
    initialList: {
      type: 'boolean',
      required: false
    },
    parentList: {
      type: 'string',
      required: false
    },
    parentListName: {
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

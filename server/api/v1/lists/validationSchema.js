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
      type: 'object',
      required: true
    },
    conditions: {
      type: 'object',
      required: true
    },
    initialList: {
      type: 'boolean',
      required: true
    },
    parentList: {
      type: 'string',
      required: true
    },
    parentListName: {
      type: 'string',
      required: true
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
      type: 'object',
      required: false
    },
    conditions: {
      type: 'object',
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


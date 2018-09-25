/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.menuPayload = {
  type: 'object',
  properties: {
    pageId: {
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
    jsonStructure: {
      type: 'object',
      required: true
    },
  }
}

exports.updatedMenuPayload = {
  type: 'object',
  properties: {
    pageId: {
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
    jsonStructure: {
      type: 'object',
      required: false
    },
  }
}


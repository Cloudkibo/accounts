/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.teamPayload = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    created_by: {
      type: 'string',
      required: true
    },
    companyId: {
      type: 'string',
      required: true
    },
    teamPages: {
      type: 'array',
      items: {
        type: 'string',
        required: true
      }
    },
    teamPagesIds: {
      type: 'array',
      items: {
        type: 'string',
        required: true
      }
    }
  }
}

exports.genericQueryPayload = {
  'type': 'object',
  'properties': {
    'type': {
      'type': 'string'
    },
    'query': {
      'type': 'object'
    }
  },
  'required': [
    'type',
    'query'
  ]
}

exports.teamUpdatePayload = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: false
    },
    description: {
      type: 'string',
      required: false
    },
    teamPages: {
      type: 'array',
      items: {
        type: 'string',
        required: false
      }
    },
    teamPagesIds: {
      type: 'array',
      items: {
        type: 'string',
        required: false
      }
    }
  }
}

exports.agentPayload = {
  type: 'object',
  properties: {
    teamId: {
      type: 'string',
      required: true
    },
    companyId: {
      type: 'string',
      required: true
    },
    agentId: {
      type: 'string',
      required: true
    }
  }
}

exports.pagePayload = {
  type: 'object',
  properties: {
    teamId: {
      type: 'string',
      required: true
    },
    companyId: {
      type: 'string',
      required: true
    },
    pageId: {
      type: 'string',
      required: true
    }
  }
}

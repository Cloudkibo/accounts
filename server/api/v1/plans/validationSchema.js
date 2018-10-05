/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.createPayload = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'unique_id': {
      'type': 'string'
    },
    'interval': {
      'type': 'string'
    },
    'trial_period': {
      'type': 'string'
    },
    'amount': {
      'type': 'string'
    }
  },
  'required': [
    'name',
    'interval',
    'trial_period',
    'amount'
  ]
}

exports.updatePayload = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'unique_id': {
      'type': 'string'
    },
    'interval': {
      'type': 'string'
    },
    'trial_period': {
      'type': 'string'
    }
  },
  'required': [
    'name',
    'unique_id',
    'trial_period'
  ]
}

exports.changeDefaultPlan = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'plan_id': {
      'type': 'string'
    },
    'account_type': {
      'type': 'string'
    }
  },
  'required': [
    'plan_id',
    'account_type'
  ]
}

exports.migrateCompanies = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'from': {
      'type': 'object'
    },
    'to': {
      'type': 'object'
    }
  },
  'required': [
    'from',
    'to'
  ]
}

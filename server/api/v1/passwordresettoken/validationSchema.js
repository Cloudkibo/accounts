exports.forgotPasswordSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      required: true
    }
  }
}

exports.resetPasswordSchema = {
  type: 'object',
  properties: {
    token: {
      type: 'string',
      required: true
    }
  }
}

exports.updatePasswordSchema = {
  type: 'object',
  properties: {
    old_password: {
      type: 'string',
      required: true
    },
    new_password: {
      type: 'string',
      required: true
    }
  }
}

/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.updateRolePermissionPayload = {
  type: 'object',
  properties: {
    role: {
      type: 'string',
      required: true
    }
  }
}

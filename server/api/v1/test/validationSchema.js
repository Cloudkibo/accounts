/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.testPayload = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    }
  }
}

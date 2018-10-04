/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.updatePostPayload = {
  type: 'object',
  properties: {
    item_name: {
      type: 'string',
      required: true
    },
    item_value: {
      type: 'integer',
      required: true
    }
  }
}

/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/
    
exports.create = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "pageId": {
        "type": "string"
      },
      "companyId": {
        "type": "string"
      },
      "userId": {
        "type": "string"
      },
      "messageContent": {
        "type": "array",
        "items": {}
      }
    },
    "required": [
      "pageId",
      "companyId",
      "userId",
      "messageContent"
    ]
}

exports.edit = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "jsonMessageId": {
      "type": "string"
    },
    "pageId": {
      "type": "string"
    },
    "companyId": {
      "type": "string"
    },
    "userId": {
      "type": "string"
    },
    "messageContent": {
      "type": "array",
      "items": {}
    }
  },
  "required": [
    "jsonMessageId",
    "pageId",
    "companyId",
    "userId",
    "messageContent"
  ]
}
  
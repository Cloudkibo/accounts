exports.createPayload = {
  type: 'object',
  properties: {
    companyId: {
      type: 'string',
      required: true
    },
    pageId: {
      type: 'string',
      required: true
    },
    ref_parameter: {
      type: 'string',
      required: true
    },
    reply: {
      type: 'array',
      required: true
    }
  }
}

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
    initialState: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string',
      required: false
    }
  }
}
exports.createStatePayload = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      required: false
    },
    description: {
      type: 'string',
      required: false
    },
    pageTemplate: {
      type: 'string',
      required: false
    },
    backgroundColor: {
      type: 'string',
      required: true
    },
    titleColor: {
      type: 'string',
      required: true
    },
    descriptionColor: {
      type: 'string',
      required: true
    },
    buttonText: {
      type: 'string',
      required: false
    },
    mediaType: {
      type: 'string',
      required: false
    },
    mediaLink: {
      type: 'string',
      required: false
    },
    mediaPlacement: {
      type: 'string',
      required: false
    }
  }
}

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
      required: true
    }
  }
}
exports.createStatePayload = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    pageTemplate: {
      type: 'string',
      required: true
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
      required: true
    },
    mediaType: {
      type: 'string',
      required: true
    },
    mediaLink: {
      type: 'string',
      required: true
    },
    mediaPlacement: {
      type: 'string',
      required: true
    }
  }
}

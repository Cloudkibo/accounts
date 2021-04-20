const smsAddOns = {
  shopifyChatbot: {
    feature: 'Shopify Chatbot',
    platform: 'sms',
    description: 'This will allow you to deploy shopify chatbot on your number and then your customers will be able to shop with the help of the chatbot.',
    price: '15',
    currency: '$',
    permissions: ['ecommerce_integration', 'ecommerce_chatbot'],
    others: {
      iconClass: 'la la-cart-plus'
    }
  },
  manualChatbot: {
    feature: 'Chatbot Automation',
    platform: 'sms',
    description: 'This will allow you to create menu driven chatbot for your number manually, very easily and with less efforts and time.',
    price: '10',
    currency: '$',
    permissions: ['chatbot_automation'],
    others: {
      iconClass: 'la la-comments'
    }
  }
}

module.exports = { smsAddOns }

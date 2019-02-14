'use strict'

// Development specific configuration
// ==================================
module.exports = {

  // Server port
  port: process.env.PORT || 3001,

  // Secure Server port
  secure_port: process.env.SECURE_PORT || 8443,

  domain: `${process.env.DOMAIN || 'https://saccounts.cloudkibo.com'}`,
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/accounts-staging'
  },
  seedDB: false,

  facebook: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: `${process.env.DOMAIN}/auth/facebook/callback`
  },

  api_urls: {
    kibochat: `${process.env.DB_LAYER_IP_KIBOCHAT}/api/v1`,
    kiboengage: `${process.env.DB_LAYER_IP_KIBOENGAGE}/api/v1`
  }
}

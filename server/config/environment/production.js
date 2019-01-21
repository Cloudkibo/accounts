// Production specific configuration
// ==================================
module.exports = {

  // Server port
  port: process.env.PORT || 3001,

  // Secure Server port
  secure_port: process.env.SECURE_PORT || 8443,

  domain: `${process.env.DOMAIN || 'https://accounts.cloudkibo.com'}`,
  
  // MongoDB connection options
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost/accounts-prod'
  },
  seedDB: false,

  facebook: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: `${process.env.DOMAIN}/auth/facebook/callback`
  }
}

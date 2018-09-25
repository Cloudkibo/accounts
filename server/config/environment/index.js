const path = require('path')
const _ = require('lodash')

const all = {
  env: process.env.NODE_ENV,

  // Need to set this secrets variable
  secrets: {
    session: process.env.SESSION_SECRET || 'some string'
  },

  // Project root path
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 3000,

  ip: process.env.IP || undefined,

  sendgrid: {
    username: 'cloudkibo',
    password: 'cl0udk1b0'
  },

  domain: `${process.env.DOMAIN || 'https://accounts.kibopush.com'}`,

  // Mongo Options
  mongo: {
    options: {
      db: {
        safe: true
      },
      useNewUrlParser: true
    }
  }
}

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {})

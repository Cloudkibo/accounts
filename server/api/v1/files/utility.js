const config = require('./../../../config/environment/index')

const corsOptions = {
  origin: function (origin, callback) {
    if (config.whitelistedDomains.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = corsOptions

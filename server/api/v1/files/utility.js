var whitelist = ['https://skiboengage.cloudkibo.com',
  'https://skibochat.cloudkibo.com',
  'http://localhost:3021',
  'http://localhost:3022',
  'https://kiboengage.cloudkibo.com',
  'https://kibochat.cloudkibo.com']

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = corsOptions

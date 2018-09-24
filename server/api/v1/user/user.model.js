let mongoose = require('mongoose')
let Schema = mongoose.Schema
let crypto = require('crypto')

const UserSchema = new Schema({
  name: String,
  email: String,
  domain: String,
  domain_email: String,
  facebookInfo: Schema.Types.Mixed,
  phone: String,
  role: String,
  hashedPassword: String,
  salt: String,
  emailVerified: {type: Boolean, default: false},
  locale: String,
  gender: String,
  provider: String, // facebook
  timezone: Number,
  profilePic: String,
  isSuperUser: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  wizardSeen: {type: Boolean, default: false},
  uiMode: String,
  advancedMode: {type: Boolean, default: false},
  eulaAccepted: {type: Boolean, default: true},
  permissionsRevoked: {type: Boolean, default: false},
  skippedFacebookConnect: {type: Boolean, default: false},
  deleteInformation: Schema.Types.Mixed //GDPR INFO
})

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function (password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashedPassword = this.encryptPassword(password)
}).get(function () {
  return this._password
})

// Public profile information
UserSchema.virtual('profile').get(function () {
  return {
    'name': this.name,
    'role': this.role
  }
})

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token').get(function () {
  return {
    '_id': this._id,
    'role': this.role
  }
})

/**
 * Validations
 */

// Validate empty email
UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

// Validate empty website
UserSchema.path('domain').validate(function (domain) {
  return domain.length
}, 'Domain name cannot be blank')

// Validate empty password
UserSchema.path('hashedPassword').validate(function (hashedPassword) {
  return hashedPassword.length
}, 'Password cannot be blank')

var validatePresenceOf = function (value) {
  return value && value.length
}

// Validate email is not taken
UserSchema.path('domain_email').validate(function (value, respond) {
  var self = this
  this.constructor.findOne({domain_email: value},
    function (err, user) {
      if (err) throw err
      if (user) {
        if (self.id === user.id) return respond(true)
        return respond(false)
      }
      respond(true)
    })
}, 'The specified email address is already in use with this workspace name.')

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.hashedPassword)) {
    next(new Error('Invalid password'))
  } else { next() }
})

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64')
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return ''
    let salt = Buffer.from(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64')
  }
}

module.exports = mongoose.model('users', UserSchema)

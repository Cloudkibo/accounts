var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

exports.setup = function (User, config) {
  passport.use('email-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function (email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function (err, user) {
      if (err) return done(err)

      if (!user) {
        return done(null, false, { message: 'This email is not registered.' })
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'This password is not correct.' })
      }
      if (user.disableMember) {
        return done(null, false, { message: 'Your account has been disabled. Please contact admin'})
      }
      return done(null, user)
    })
  }
  ))
}

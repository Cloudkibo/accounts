
module.exports = function (app) {
  // API middlewares go here
  app.use('/api/v1/test', require('./api/v1/test'))
  app.use('/api/v1/user', require('./api/v1/user'))
  app.use('/api/v1/teams', require('./api/v1/teams'))
  app.use('/api/v1/comment_capture', require('./api/v1/comment_capture'))
  app.use('/api/v1/pages', require('./api/v1/pages'))
  app.use('/api/v1/lists', require('./api/v1/lists'))
  app.use('/api/v1/menu', require('./api/v1/menu'))
  app.use('/api/v1/plans', require('./api/v1/plans'))
  app.use('/api/v1/subscribers', require('./api/v1/subscribers'))
  app.use('/api/v1/reset_password', require('./api/v1/passwordresettoken'))
  app.use('/api/v1/permissions', require('./api/v1/permissions'))
  app.use('/api/v1/companyprofile', require('./api/v1/companyprofile'))
  app.use('/api/v1/companyUser', require('./api/v1/companyuser'))
  app.use('/api/v1/featureusage', require('./api/v1/featureUsage'))
  app.use('/api/v1/invitations', require('./api/v1/invitations'))
  app.use('/api/v1/inviteagenttoken', require('./api/v1/inviteagenttoken'))
  app.use('/api/v1/passwordresettoken', require('./api/v1/passwordresettoken'))
  app.use('/api/v1/companyprofile', require('./api/v1/companyprofile'))
  app.use('/api/v1/permissions_plan', require('./api/v1/permissions_plan'))
  app.use('/api/v1/phone', require('./api/v1/phone'))
  app.use('/api/v1/verificationtoken', require('./api/v1/verificationtoken'))
  app.use('/api/v1/webhooks', require('./api/v1/webhooks'))

  // auth middleware go here
  app.use('/auth', require('./auth'))

  // index page
  app.get('/', function (req, res) {
    res.render('layouts/index', {
      buttonOne: { name: 'Login', url: `/login?continue=${req.query.continue ? req.query.continue : ''}` },
      buttonTwo: { name: 'Sign Up', url: `/signup?continue=${req.query.continue ? req.query.continue : ''}` }
    })
  })

  // login page
  app.get('/login', function (req, res) {
    res.render('layouts/index', {
      buttonOne: { name: 'Individual Account', url: `/login/single?continue=${req.query.continue ? req.query.continue : ''}` },
      buttonTwo: { name: 'Team Account', url: `/login/team?continue=${req.query.continue ? req.query.continue : ''}` }
    })
  })

  // signup page
  app.get('/signup', function (req, res) {
    res.render('layouts/index', {
      buttonOne: { name: 'Individual Account', url: `/signup/single?continue=${req.query.continue ? req.query.continue : ''}` },
      buttonTwo: { name: 'Team Account', url: `/signup/team?continue=${req.query.continue ? req.query.continue : ''}` }
    })
  })

  // login page
  app.get('/login/single', function (req, res) {
    let Continue = req.query.continue
    console.log(Continue)
    res.render('layouts/login', {individual: true, Continue: req.query.continue ? req.query.continue : ''})
  })

  // login page
  app.get('/login/team', function (req, res) {
    res.render('layouts/login', {individual: false, Continue: req.query.continue ? req.query.continue : ''})
  })

  // signup page
  app.get('/signup/single', function (req, res) {
    res.render('layouts/signup', {individual: true,
      data: [
        {name: 'Customer Engagement', value: 'engage'},
        {name: 'Customer Chat', value: 'chat'},
        {name: 'Ecommerce', value: 'ecommerce'},
        {name: 'All', value: 'all'}
      ],
      Continue: req.query.continue})
  })

  // signup page
  app.get('/signup/team', function (req, res) {
    res.render('layouts/signup', {individual: false,
      data: [
        {name: 'Customer Engagement', value: 'engage'},
        {name: 'Customer Chat', value: 'chat'},
        {name: 'Ecommerce', value: 'ecommerce'},
        {name: 'All', value: 'all'}
      ],
      Continue: req.query.continue})
  })

  // login page
  app.get('/forgotPassword', function (req, res) {
    res.render('layouts/forgotPassword')
  })

  app.route('/:url(api|auth)/*').get((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  }).post((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  })
}

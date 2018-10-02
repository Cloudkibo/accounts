
module.exports = function (app) {
  // API middlewares go here
  app.use('/api/v1/test', require('./api/v1/test'))
  app.use('/api/v1/user', require('./api/v1/user'))
  app.use('/api/v1/teams', require('./api/v1/teams'))
  app.use('/api/v1/comment_capture', require('./api/v1/comment_capture'))
  app.use('/api/v1/page', require('./api/v1/pages'))
  app.use('/api/v1/list', require('./api/v1/lists'))
  app.use('/api/v1/menu', require('./api/v1/menu'))
  app.use('/api/v1/subscriber', require('./api/v1/subscribers'))
  app.use('/api/v1/reset_password', require('./api/v1/passwordresettoken'))

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
    res.render('layouts/login', {individual: true, continue: req.query.continue})
  })

  // login page
  app.get('/login/team', function (req, res) {
    res.render('layouts/login', {individual: false, continue: req.query.continue})
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
      continue: req.query.continue})
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
      continue: req.query.continue})
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

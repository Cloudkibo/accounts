const config = require('./config/environment/index')
const logger = require('./../server/components/logger')
const TAG = '/server/routes.js'
const Raven = require('raven')
const cors = require('cors')
const controller = require('./api/v1/files/files.controller')
const corsOptions = require('./api/v1/files/utility')
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()

module.exports = function (app) {
  // API middlewares go here
  app.use('/api/v1/test', require('./api/v1/test'))
  app.use('/api/v1/user', require('./api/v1/user'))
  app.use('/api/v1/teams', require('./api/v1/teams'))
  app.use('/api/v1/comment_capture', require('./api/v1/comment_capture'))
  app.use('/api/v1/messenger_code', require('./api/v1/messenger_code'))
  app.use('/api/v1/pages', require('./api/v1/pages'))
  app.use('/api/v1/lists', require('./api/v1/lists'))
  app.use('/api/v1/menu', require('./api/v1/menu'))
  app.use('/api/v1/plans', require('./api/v1/plans'))
  app.use('/api/v1/subscribers', require('./api/v1/subscribers'))
  app.use('/api/v1/reset_password', require('./api/v1/passwordresettoken'))
  app.use('/api/v1/permissions', require('./api/v1/permissions'))
  app.use('/api/v1/companyprofile', require('./api/v1/companyprofile'))
  app.use('/api/v1/companyUser', require('./api/v1/companyuser'))
  app.use('/api/v1/featureUsage', require('./api/v1/featureUsage'))
  app.use('/api/v1/invitations', require('./api/v1/invitations'))
  app.use('/api/v1/inviteagenttoken', require('./api/v1/inviteagenttoken'))
  app.use('/api/v1/permissions_plan', require('./api/v1/permissions_plan'))
  app.use('/api/v1/phone', require('./api/v1/phone'))
  app.use('/api/v1/verificationtoken', require('./api/v1/verificationtoken'))
  app.use('/api/v1/webhooks', require('./api/v1/webhooks'))
  app.use('/api/v1/api_settings', require('./api/v1/api_settings'))
  app.use('/api/v1/tags_subscriber', require('./api/v1/tags_subscriber'))
  app.use('/api/v1/tags', require('./api/v1/tags'))
  app.use('/api/v1/landingPage', require('./api/v1/landingPage'))
  app.use('/api/v1/pageReferrals', require('./api/v1/pageReferrals'))
  app.use('/api/v1/jsonAd', require('./api/v1/jsonAd'))
  app.use('/api/scripts', require('./api/scripts'))
  app.use('/api/v1/custom_fields', require('./api/v1/custom_fields'))
  app.use('/api/v1/custom_field_subscribers', require('./api/v1/custom_field_subscribers'))
  app.use('/api/kibodash', require('./api/v1/kiboDash'))
  app.use('/api/v1/contacts', require('./api/v1/contacts'))
  app.use('/api/v1/sponsoredmessaging', require('./api/v1/sponsoredMessaging'))
  app.use('/api/v1/whatsAppContacts', require('./api/v1/whatsAppContacts'))
  app.use('/api/v1/api_ngp', require('./api/v1/api_ngp'))
  
  // auth middleware go here
  app.use('/auth', require('./auth'))

  app.options('/uploadFile', cors(corsOptions))
  app.post('/uploadFile', cors(), multipartyMiddleware, controller.index)

  app.options('/api/v1/files/download/:id', cors(corsOptions))
  app.get('/api/v1/files/download/:id', cors(), controller.download)

  app.options('/uploadTemplate', cors(corsOptions))
  app.post('/uploadTemplate', cors(), controller.uploadForTemplate)

  app.options('/downloadYouTubeVideo', cors(corsOptions))
  app.post('/downloadYouTubeVideo', cors(), controller.downloadYouTubeVideo)

  // index page
  app.get('/', function (req, res) {
    res.render('layouts/index', {
      buttonOne: { name: 'Login', url: `/login?continue=${req.query.continue ? req.query.continue : ''}` },
      buttonTwo: { name: 'Sign Up', url: `/signup?continue=${req.query.continue ? req.query.continue : ''}` }
    })
  })

  // login page
  // app.get('/login', function (req, res) {
  //   res.render('layouts/index', {
  //     buttonOne: { name: 'Individual Account', url: `/login/single?continue=${req.query.continue ? req.query.continue : ''}` },
  //     buttonTwo: { name: 'Team Account', url: `/login/team?continue=${req.query.continue ? req.query.continue : ''}` }
  //   })
  // })

  // signup page
  app.get('/signup', function (req, res) {
    res.render('layouts/index', {
      buttonOne: { name: 'Individual Account', url: `/signup/single?continue=${req.query.continue ? req.query.continue : ''}` },
      buttonTwo: { name: 'Team Account', url: `/signup/team?continue=${req.query.continue ? req.query.continue : ''}` }
    })
  })

  // login page
  app.get('/login', function (req, res) {
    res.render('layouts/login', {Continue: req.query.continue ? req.query.continue : ''})
  })

  // login page
  // app.get('/login/team', function (req, res) {
  //   res.render('layouts/login', {individual: false, Continue: req.query.continue ? req.query.continue : ''})
  // })

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
    res.render('layouts/forgotPassword', {Continue: req.query.Continue ? req.query.Continue : ''})
  })
  app.get('/forgotWorkspaceName', function (req, res) {
    res.render('layouts/forgotWorkspaceName', {Continue: req.query.Continue ? req.query.Continue : ''})
  })
  app.get('/invitation', function (req, res) {
    res.render('layouts/invitationExpire', {expireLink: true})
  })

  app.route('/:url(api|auth)/*').get((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  }).post((req, res) => {
    res.status(404).send({url: `${req.originalUrl} not found`})
  })

  if (config.env === 'production' || config.env === 'staging') {
    app.use(Raven.errorHandler())
    app.use(function (err, req, res, next) {
      console.error(err.stack)
      logger.serverLog(TAG, err.stack)
      logger.serverLog(TAG, err.message)
      if (err.message === 'jwt expired') {
        res.clearCookie('token')
        return res.status(401).json({status: 'Unauthorized', payload: 'jwt expired'})
      }
      res.status(500).send('Something broke! Please go to home page')
      /**
       * Further logic for error handling.
       * You may integrate with Crash reporting tool like Raven.
       */
    })
  }
}

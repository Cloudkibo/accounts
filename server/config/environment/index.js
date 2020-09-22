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

  ip: process.env.IP || undefined,

  userRoles: ['buyer', 'admin', 'supervisor', 'agent'],
  allowedIps: ['::ffff:142.93.66.26', '::ffff:165.227.178.70', '::ffff:167.99.56.161', '::ffff:159.65.47.134', '::ffff:159.203.175.244', '::ffff:159.89.185.221', '::ffff:165.227.66.158', '::ffff:104.131.67.58', '::ffff:165.227.130.222', '::ffff:127.0.0.1'],
  sendgrid: {
    username: process.env.SENDGRID_USERNAME,
    password: process.env.SENDGRID_PASSWORD
  },
  captchaKey: process.env.CAPTCHA_KEY || '6LckQ14UAAAAAFH2D15YXxH9o9EQvYP3fRsL2YOU',
  stripeOptions: {
    apiKey: process.env.STRIPE_KEY || 'sk_test_gB8zWtkvbbYFbFFnuj3t4EZn',
    product: 'prod_CxuUOUCZj9ZqwG',
    stripePubKey: process.env.STRIPE_PUB_KEY || 'pk_test_ozzmt2lgDgltSYx1pO4W2IE2',
    plans: ['plan_A', 'plan_B', 'plan_C', 'plan_D'],
    planData: {
      'plan_A': {
        name: 'plan_A',
        price: 10
      },
      'plan_B': {
        name: 'plan_B',
        price: 0
      },
      'plan_C': {
        name: 'plan_C',
        price: 15
      },
      'plan_D': {
        name: 'plan_D',
        price: 0
      }
    }
  },
  uiModes: {
    kiboengage: {
      mode: 'kiboengage',
      broadcasts: true,
      polls: true,
      surveys: true,
      sequenceMessaging: true,
      templates: true,
      livechat: false,
      smartReplies: false,
      abandonedCarts: false,
      subscribers: true,
      segmentSubscribers: true,
      autoposting: true,
      persistentMenu: true,
      pages: true,
      phoneNumber: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      commentCapture: true
    },
    kibochat: {
      mode: 'kibochat',
      broadcasts: false,
      polls: false,
      surveys: false,
      sequenceMessaging: false,
      templates: false,
      livechat: true,
      smartReplies: true,
      abandonedCarts: false,
      subscribers: true,
      segmentSubscribers: true,
      autoposting: false,
      persistentMenu: true,
      pages: true,
      phoneNumber: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      commentCapture: true
    },
    kibocommerce: {
      mode: 'kibocommerce',
      broadcasts: false,
      polls: false,
      surveys: false,
      sequenceMessaging: false,
      templates: false,
      livechat: false,
      smartReplies: false,
      abandonedCarts: true,
      subscribers: true,
      segmentSubscribers: true,
      autoposting: false,
      persistentMenu: true,
      pages: true,
      phoneNumber: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      commentCapture: true
    },
    all: {
      mode: 'all',
      broadcasts: true,
      polls: true,
      surveys: true,
      sequenceMessaging: true,
      templates: true,
      livechat: true,
      smartReplies: true,
      abandonedCarts: true,
      subscribers: true,
      segmentSubscribers: true,
      autoposting: true,
      persistentMenu: true,
      pages: true,
      phoneNumber: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      commentCapture: true
    }
  },

  permissions: {
    admin: {
      billingPermission: false,
      downgradeService: false,
      upgradeService: false,
      terminateService: false,
      customerMatchingPermission: true,
      dashboardPermission: true,
      companyPermission: true,
      companyUpdatePermission: false,
      membersPermission: true,
      inviteAdminPermission: true,
      deleteAdminPermission: true,
      promoteToAdminPermission: true,
      inviteAgentPermission: true,
      deleteAgentPermission: true,
      updateRolePermission: true,
      invitationsPermission: true,
      broadcastPermission: true,
      autopostingPermission: true,
      livechatPermission: true,
      menuPermission: true,
      pagesAccessPermission: true,
      pagesPermission: true,
      pollsPermission: true,
      subscriberPermission: true,
      surveyPermission: true,
      apiPermission: false
    },
    agent: {
      billingPermission: false,
      downgradeService: false,
      upgradeService: false,
      terminateService: false,
      customerMatchingPermission: false,
      dashboardPermission: true,
      companyPermission: true,
      companyUpdatePermission: false,
      membersPermission: true,
      inviteAdminPermission: false,
      deleteAdminPermission: false,
      updateRolePermission: false,
      inviteAgentPermission: false,
      deleteAgentPermission: false,
      invitationsPermission: false,
      broadcastPermission: true,
      autopostingPermission: true,
      livechatPermission: true,
      menuPermission: true,
      pagesAccessPermission: true,
      pagesPermission: false,
      pollsPermission: true,
      subscriberPermission: true,
      surveyPermission: true,
      apiPermission: false
    }
  },

  whitelistedDomains: [process.env.KIBOENGAGE || 'http://localhost:3021', process.env.KIBOCHAT || 'http://localhost:3022', process.env.KIBOLITE || 'http://localhost:8000', 'https://kiboapi.cloudkibo.com', 'http://localhost:3000'],
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

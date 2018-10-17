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
  port: process.env.PORT || 3001,

  // Secure Server port
  secure_port: process.env.SECURE_PORT || 8443,

  ip: process.env.IP || undefined,

  sendgrid: {
    username: 'cloudkibo',
    password: 'cl0udk1b0'
  },

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

  domain: `${process.env.DOMAIN || 'https://accounts.cloudkibo.com'}`,

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

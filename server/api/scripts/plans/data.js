const smsPlans = {
  basic: {
    name: 'Basic Plan',
    unique_ID: 'sms_plan_A',
    amount: 35,
    interval: 'monthly',
    platform: 'sms',
    trial_period: 30
  },
  standard: {
    name: 'Standard Plan',
    unique_ID: 'sms_plan_B',
    amount: 45,
    interval: 'monthly',
    platform: 'sms',
    trial_period: 30
  },
  premium: {
    name: 'Premium Plan',
    unique_ID: 'sms_plan_C',
    amount: 60,
    interval: 'monthly',
    platform: 'sms',
    trial_period: 30
  },
  enterprise: {
    name: 'Enterprise Plan',
    unique_ID: 'sms_plan_D',
    interval: 'monthly',
    platform: 'sms',
    trial_period: 30
  }
}

module.exports = { smsPlans }

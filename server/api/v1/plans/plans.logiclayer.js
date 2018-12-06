/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

const prepareUID = (plans) => {
  let lastUID = plans[plans.length - 1].unique_ID
  let temp = lastUID.split('_')
  let uid = String.fromCharCode(temp[1].charCodeAt() + 1)

  return uid
}

const preparePlanDataPayload = (body, uid) => {
  let planData = {
    name: body.name,
    unique_ID: 'plan_' + uid,
    amount: body.amount,
    interval: body.interval,
    trial_period: body.trial_period
  }

  return planData
}

const prepareStripePayload = (body, uid, stripeOptions) => {
  let payload = {
    amount: body.amount * 100,
    id: 'plan_' + uid,
    currency: 'usd',
    nickname: body.name,
    interval: body.interval,
    trial_period_days: body.trial_period,
    product: stripeOptions.product
  }

  return payload
}

const planBPayload = () => {
  return {
    name: 'Individual Basic Plan',
    unique_ID: 'plan_B',
    amount: 0
  }
}

const planAPayload = () => {
  return {
    name: 'Individual Premium Plan',
    unique_ID: 'plan_A',
    amount: 10,
    interval: 'monthly',
    default_individual: true
  }
}

const planCPayload = () => {
  return {
    name: 'Team Premium Plan',
    unique_ID: 'plan_C',
    amount: 15,
    interval: 'monthly',
    default_team: true
  }
}

const planDPayload = () => {
  return {
    name: 'Team Basic Plan',
    unique_ID: 'plan_D',
    amount: 0
  }
}

exports.prepareUID = prepareUID
exports.prepareStripePayload = prepareStripePayload
exports.planAPayload = planAPayload
exports.planBPayload = planBPayload
exports.planCPayload = planCPayload
exports.planDPayload = planDPayload

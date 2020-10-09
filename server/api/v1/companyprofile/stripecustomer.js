'use strict'

var Stripe = require('stripe')
var stripe

module.exports = exports = function stripeCustomer (schema, options) {
  stripe = Stripe(options.apiKey)

  schema.add({
    stripe: {
      customerId: String,
      subscriptionId: String,
      last4: String,
      plan: String
    }
  })

  schema.methods.createCustomer = function (email, name, cb) {
    var company = this

    stripe.customers.create({
      email: email,
      description: name
    }, function (err, customer) {
      if (err) return cb(err)

      company.stripe.customerId = customer.id
      company.save(function (err) {
        if (err) return cb(err)
        return cb(null)
      })
    })
  }

  schema.statics.getPlans = function () {
    return options.planData
  }

  schema.methods.setCard = function (stripeToken, cb) {
    var company = this
    var cardHandler = function (err, customer) {
      if (err) return cb(err)

      if (!company.stripe.customerId) {
        company.stripe.customerId = customer.id
      }

      var card = customer.cards ? customer.cards.data[0] : customer.sources.data[0]

      company.stripe.last4 = card.last4
      company.save(function (err) {
        if (err) return cb(err)
        return cb(null)
      })
    }

    if (company.stripe.customerId) {
      stripe.customers.update(company.stripe.customerId, {card: stripeToken}, cardHandler)
    } else {
      stripe.customers.create({
        card: stripeToken
      }, cardHandler)
    }
  }

  schema.methods.setPlan = function (plan, stripeToken, cb) {
    var company = this

    var subscriptionHandler = function (err, subscription) {
      if (err) return cb(err)

      company.stripe.plan = plan
      company.stripe.subscriptionId = subscription.id
      company.save(function (err) {
        if (err) return cb(err)
        return cb(null)
      })
    }

    var createSubscription = function () {
      stripe.customers.createSubscription(
        company.stripe.customerId,
        {plan: plan},
        subscriptionHandler
      )
    }

    if (stripeToken) {
      company.setCard(stripeToken, function (err) {
        if (err) return cb(err)
        createSubscription()
      })
    } else {
      if (company.stripe.subscriptionId) {
        // update subscription
        stripe.customers.updateSubscription(
          company.stripe.customerId,
          company.stripe.subscriptionId,
          { plan: plan },
          subscriptionHandler
        )
      } else {
        createSubscription()
      }
    }
  }

  schema.methods.updateStripeEmail = function (cb) {
    var company = this

    if (!company.stripe.customerId) return cb()

    stripe.customers.update(company.stripe.customerId, {email: company.email}, function (err, customer) {
      cb(err)
    })
  }

  schema.methods.chargeCustomer = function (charge, cb) {
    var company = this
    if (
      !company.stripe || (company.stripe && (!company.stripe.customerId || !company.stripe.subscriptionId))
    ) {
      cb(new Error('Fata Error! Billing is not set for this account. Please contact support.'))
    } else if (!company.stripe.last4) {
      cb(new Error('Payment method is not set for this account. Please set the payment method from settings'))
    } else {
      stripe.charges.create({
        amount: charge.amount * 100,
        currency: charge.currency,
        customer: company.stripe.customerId,
        description: charge.description
      }, function (err, response) {
        if (err) {
          cb(err.message || err)
        } else {
          cb(null, response)
        }
      })
    }
  }

  schema.methods.cancelStripe = function (cb) {
    var company = this

    if (company.stripe.customerId) {
      stripe.customers.del(
        company.stripe.customerId
      ).then(function (confirmation) {
        cb()
      }, function (err) {
        return cb(err)
      })
    } else {
      cb()
    }
  }
}

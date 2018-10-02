/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/
const dataLayer = require('./user.datalayer')
const crypto = require('crypto')

const prepareUpdateUserPayload = (name, email, uiMode) => {
  let flag = true
  let temp = {}
  name ? temp.name = name : flag = false
  email ? temp.email = email : flag = false
  uiMode ? temp.uiMode = uiMode : flag = false

  return temp
}

const prepareUserPayload = (body, isTeam) => {
  let random = getRandomString()
  let payload = {
    name: body.name,
    password: body.password,
    email: body.email.toLowerCase(),
    uiMode: body.uiMode,
    accountType: isTeam ? 'team' : 'individual',
    role: 'buyer',
    domain: isTeam ? body.domain.toLowerCase() : random,
    domainEmail: isTeam
      ? body.domain.toLowerCase() + '' + body.email.toLowerCase()
      : random + body.email.toLowerCase()
  }

  return payload
}

const isTeamAccount = (body) => {
  let flag
  body.domain ? flag = true : flag = false
  return flag
}

const getRandomString = () => {
  let today = new Date()
  let uid = crypto.randomBytes(5).toString('hex')
  return 'f' + uid + '' + today.getFullYear() + '' +
          (today.getMonth() + 1) + '' + today.getDate() + '' +
          today.getHours() + '' + today.getMinutes() + '' +
          today.getSeconds()
}

const isEmailAndDomainFound = (body) => {
  let temp = {}

  return new Promise((resolve, reject) => {
    dataLayer
      .findOneUserByEmail(body)
      .then(userWithEmail => {
        userWithEmail
          ? temp.email = true
          : temp.email = false

        dataLayer
          .findOneUserByDomain(body)
          .then(userWithDomain => {
            userWithDomain
              ? temp.domain = true
              : temp.domain = false
            resolve(temp)
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}

exports.getRandomString = getRandomString
exports.isEmailAndDomainFound = isEmailAndDomainFound
exports.isTeamAccount = isTeamAccount
exports.prepareUserPayload = prepareUserPayload
exports.prepareUpdateUserPayload = prepareUpdateUserPayload

const logger = require('../../../components/logger')
const dataLayer = require('./landingPage.datalayer')
const dataLayerState = require('./landingPageState.datalayer')
const landingPageStateDataLayer = require('./landingPageState.datalayer')
const TAG = '/api/v1/landingPage/landingPage.controller.js'

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Hit the create landing page controller', req.body)
  console.log('req.body', req.body)
  dataLayer.createLandingPage(req.body)
    .then(result => {
      console.log('result', result)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.query = function (req, res) {
  logger.serverLog(TAG, 'Hit the query endpoint for landing page controller')
  dataLayer.findLandingPages(req.body)
    .then(result => {
      let landingPages = []
      for (let i = 0; i < result.length; i++) {
        landingPages.push({
          initialState: result[i].initialState,
          submittedState: result[i].submittedState,
          isActive: result[i].isActive,
          pageId: result[i].pageId,
          optInMessage: result[i].optInMessage,
          companyId: result[i].companyId,
          _id: result[i]._id
        })
        if (result[i].submittedState.actionType === 'SHOW_NEW_MESSAGE') {
          dataLayerState.findOneLandingPageState(result[i].submittedState.state)
            .then(state => {
              landingPages[i].submittedState.state = state
              if (i === result.length - 1) {
                res.status(200).json({status: 'success', payload: landingPages})
              }
            })
            .catch(err => {
              console.log('failed to fetch landing page state', err)
            })
        }
      }
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.update = function (req, res) {
  logger.serverLog(TAG, 'Hit the update landing page controller')
  dataLayer.updateLandingPage(req.params._id, req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.delete = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete landing page controller')

  dataLayer.deleteLandingPage(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.createLandingPageState = function (req, res) {
  logger.serverLog(TAG, 'Hit the create landing page state controller', req.body)
  landingPageStateDataLayer.createLandingPageState(req.body)
    .then(result => {
      console.log('result', result)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.updateLandingPageState = function (req, res) {
  logger.serverLog(TAG, 'Hit the update landing page state controller')
  landingPageStateDataLayer.updateLandingPageState(req.params._id, req.body)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.deleteLandingPageState = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete landing page controller')

  landingPageStateDataLayer.deleteLandingPageState(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

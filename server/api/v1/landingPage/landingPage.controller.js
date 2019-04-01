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
      if (result.length > 0) {
        //populateSubmittedState(result)
          //.then(result => {
            console.log('result here', result)
            res.status(200).json({status: 'success', payload: result})
          //})
          // .catch(err => {
          //   res.status(500).json({status: 'failed', payload: err})
          // })
      } else {
        res.status(200).json({status: 'success', payload: []})
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
  console.log('Hit the update landing page state controller', req.body)
  landingPageStateDataLayer.updateLandingPageState(req.params._id, req.body)
    .then(result => {
      console.log('result of updateLandingPageState', result)
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}

exports.deleteLandingPageState = function (req, res) {
  logger.serverLog(TAG, 'Hit the delete landing page controller', req.params._id)

  landingPageStateDataLayer.deleteLandingPageState(req.params._id)
    .then(result => {
      res.status(200).json({status: 'success', payload: result})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: err})
    })
}
function populateSubmittedState (result) {
  return new Promise(function (resolve, reject) {
    let landingPages = []
    for (let i = 0; i < result.length; i++) {
      console.log('result', result[i])
      console.log('result[i].submittedState.actionType', result[i].submittedState.actionType)
      if (result[i].submittedState.actionType === 'SHOW_NEW_MESSAGE' && result[i].submittedState.state) {
        dataLayerState.findOneLandingPageState(result[i].submittedState.state)
          .then(state => {
            console.log('inside if state', state)
            landingPages.push({
              initialState: {
                _id: result[i].initialState._id,
                title: result[i].initialState.title,
                description: result[i].initialState.description,
                pageTemplate: result[i].initialState.pageTemplate,
                backgroundColor: result[i].initialState.backgroundColor,
                titleColor: result[i].initialState.titleColor,
                descriptionColor: result[i].initialState.descriptionColor,
                buttonText: result[i].initialState.buttonText,
                mediaType: result[i].initialState.mediaType,
                mediaLink: result[i].initialState.mediaLink,
                mediaPlacement: result[i].initialState.mediaPlacement
              },
              submittedState: {
                actionType: result[i].submittedState.actionType,
                title: result[i].submittedState.title,
                description: result[i].submittedState.description,
                buttonText: result[i].submittedState.buttonText,
                state: {
                  backgroundColor: state.backgroundColor,
                  titleColor: state.titleColor,
                  descriptionColor: state.descriptionColor,
                  mediaType: state.mediaType,
                  mediaLink: state.mediaLink,
                  mediaPlacement: state.mediaPlacement
                }
              },
              isActive: result[i].isActive,
              pageId: {
                _id: result[i].pageId._id,
                pageName: result[i].pageId.pageName,
                pageId: result[i].pageId.pageId
              },
              optInMessage: result[i].optInMessage,
              companyId: result[i].companyId,
              _id: result[i]._id
            })
            if (i === result.length - 1) {
              resolve({landingPages: landingPages})
            }
          })
          .catch(err => {
            console.log('failed to fetch landing page state', err)
          })
      } else {
        landingPages.push({
          initialState: {
            _id: result[i].initialState._id,
            title: result[i].initialState.title,
            description: result[i].initialState.description,
            pageTemplate: result[i].initialState.pageTemplate,
            backgroundColor: result[i].initialState.backgroundColor,
            titleColor: result[i].initialState.titleColor,
            descriptionColor: result[i].initialState.descriptionColor,
            buttonText: result[i].initialState.buttonText,
            mediaType: result[i].initialState.mediaType,
            mediaLink: result[i].initialState.mediaLink,
            mediaPlacement: result[i].initialState.mediaPlacement
          },
          submittedState: {
            actionType: result[i].submittedState.actionType,
            title: result[i].submittedState.title,
            description: result[i].submittedState.description,
            buttonText: result[i].submittedState.buttonText,
            url: result[i].submittedState.url ? result[i].submittedState.url : '',
            tab: result[i].submittedState.tab ? result[i].submittedState.tab : ''
          },
          isActive: result[i].isActive,
          pageId: {
            _id: result[i].pageId._id,
            pageName: result[i].pageId.pageName,
            pageId: result[i].pageId.pageId
          },
          optInMessage: result[i].optInMessage,
          companyId: result[i].companyId,
          _id: result[i]._id
        })
        if (i === result.length - 1) {
          resolve({landingPages: landingPages})
        }
      }
    }
  })
}

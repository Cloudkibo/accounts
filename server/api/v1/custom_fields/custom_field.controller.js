// Web layer of this API node
const logger = require('../../../components/logger')
const DataLayer = require('./custom_field.datalayer')
const CUSTOMFIELD = '/api/v1/kiboengage/tags/custom_field.controller.js'

const util = require('util')

exports.index = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Index endpoint is hit:`)
  DataLayer.findAllCustomFieldObjects()
    .then(foundObjects => {
      res.status(200).json({ status: 'success', payload: foundObjects })
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found Index Controller : ${util.inspect(err)}`)
      res.status(500).json({ status: 'failed', payload: err.toString() })
    })
}

exports.create = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Create endpoint is hit:`)
  let query = {
    purpose: 'findOne',
    match: {
      name: req.body.name
    }
  }
  DataLayer.findCustomFieldsUsingQuery(query)
    .then(foundCustomFields => {
      if (foundCustomFields) {
        res.status(500).json({ status: 'failed', messsage: `${req.body.name} custom field already exists` })
      } else {
        DataLayer.createOneCustomFieldObject(req.body)
          .then(createdObject => {
            res.status(200).json({ status: 'success', payload: createdObject })
          })
          .catch(err => {
            logger.serverLog(CUSTOMFIELD, `Error found create Controller : ${util.inspect(err)}`)
            res.status(500).json({ status: 'failed', payload: err.toString() })
          })
      }
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found create Controller : ${util.inspect(err)}`)
      res.status(500).json({ status: 'failed', payload: err.toString() })
    })
}

exports.query = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Query endpoint is hit:`)

  DataLayer.findCustomFieldsUsingQuery(req.body)
    .then(foundObjects => {
      res.status(200).json({ status: 'success', payload: foundObjects })
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found Query Controller : ${util.inspect(err)}`)
      res.status(500).json({ status: 'failed', payload: err.toString() })
    })
}

exports.update = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Update endpoint is hit:`)
  if (req.body.updated.name) {
    let query = {
      purpose: 'findOne',
      match: {
        name: req.body.updated.name
      }
    }
    DataLayer.findCustomFieldsUsingQuery(query)
      .then(foundCustomField => {
        if (foundCustomField) {
          console.log(foundCustomField)
          res.status(500).json({ status: 'failed', messsage: `${req.body.updated.name} custom field already exists` })
        } else {
          DataLayer.updateCustomField(req.body)
            .then(foundObjects => {
              res.status(200).json({ status: 'success', payload: foundObjects })
            })
            .catch(err => {
              logger.serverLog(CUSTOMFIELD, `Error found Update Controller : ${util.inspect(err)}`)
              res.status(500).json({ status: 'failed', payload: err.toString() })
            })
        }
      })
      .catch(err => {
        logger.serverLog(CUSTOMFIELD, `Error found update Controller : ${util.inspect(err)}`)
        res.status(500).json({ status: 'failed', payload: err.toString() })
      })
  } else {
    DataLayer.updateCustomField(req.body)
      .then(foundObjects => {
        res.status(200).json({ status: 'success', payload: foundObjects })
      })
      .catch(err => {
        logger.serverLog(CUSTOMFIELD, `Error found Update Controller : ${util.inspect(err)}`)
        res.status(500).json({ status: 'failed', payload: err.toString() })
      })
  }
}

exports.delete = function (req, res) {
  logger.serverLog(CUSTOMFIELD, `Delete endpoint is hit:`)
  DataLayer.deleteCustomField(req.body)
    .then(result => {
      res.status(200).json({ status: 'success', payload: result })
    })
    .catch(err => {
      logger.serverLog(CUSTOMFIELD, `Error found Delete Controller : ${util.inspect(err)}`)
      res.status(500).json({ status: 'failed', payload: err.toString() })
    })
}

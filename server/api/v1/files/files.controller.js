const logger = require('../../../components/logger')
const TAG = '/api/v1/files/files.controller.js'
const config = require('./../../../config/environment/index')
const pageDataLayer = require('../pages/pages.datalayer')
const needle = require('needle')
const path = require('path')
const fs = require('fs')
let request = require('request')
const crypto = require('crypto')
const youtubedl = require('youtube-dl')
const { sendSuccessResponse, sendErrorResponse } = require('../../global/response')

exports.index = function (req, res) {
  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  var serverPath = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate()
  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()
  let fext = req.files.file.name.split('.')
  serverPath += '.' + fext[fext.length - 1].toLowerCase()

  let dir = path.resolve(__dirname, '../../../../broadcastFiles/')

  if (req.files.file.size === 0) {
    sendErrorResponse(res, 400, '', 'No file submitted')
  }
  fs.rename(
    req.files.file.path,
    dir + '/userfiles/' + serverPath,
    err => {
      if (err) {
        logger.serverLog('internal server error', `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
        sendErrorResponse(res, 500, '', 'internal server error' + JSON.stringify(err))
      }
      if (req.body.pages && req.body.pages !== 'undefined' && req.body.pages.length > 0) {
        // saving this file to send files with its original name
        // it will be deleted once it is successfully uploaded to facebook
        let readData = fs.createReadStream(dir + '/userfiles/' + serverPath)
        let writeData = fs.createWriteStream(dir + '/userfiles/' + req.files.file.name)
        readData.pipe(writeData)
        let pages = JSON.parse(req.body.pages)
        pageDataLayer.findOnePageObject(pages[0])
          .then(page => {
            needle.get(
              `https://graph.facebook.com/v6.0/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
              (err, resp2) => {
                if (err) {
                  const message = err || `Failed to get page access_token from Graph Api`
                  logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
                  sendErrorResponse(res, 500, '', 'unable to get page access_token: ' + JSON.stringify(err))
                }
                let pageAccessToken = resp2.body.access_token
                let fileReaderStream = fs.createReadStream(dir + '/userfiles/' + req.files.file.name)
                const messageData = {
                  'message': JSON.stringify({
                    'attachment': {
                      'type': req.body.componentType,
                      'payload': {
                        'is_reusable': true
                      }
                    }
                  }),
                  'filedata': fileReaderStream
                }
                request(
                  {
                    'method': 'POST',
                    'json': true,
                    'formData': messageData,
                    'uri': 'https://graph.facebook.com/v6.0/me/message_attachments?access_token=' + pageAccessToken
                  },
                  function (err, resp) {
                    deleteFile(req.files.file.name)
                    if (err) {
                      const message = 'unable to upload attachment on Facebook, sending response ' + JSON.stringify(err)
                      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
                      sendErrorResponse(res, 500, '', 'unable to upload attachment on Facebook, sending response' + JSON.stringify(err))
                    } else if (resp.body && resp.body.error) {
                      const message = 'unable to upload attachment on Facebook, sending response ' + JSON.stringify(resp.body.error)
                      logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
                      sendErrorResponse(res, 500, '', resp.body.error.message)
                    } else {
                      logger.serverLog(
                        `file uploaded on Facebook index ${JSON.stringify(resp.body)}`, `${TAG}: exports.index`)
                      let payload = {
                        id: serverPath,
                        attachment_id: resp.body.attachment_id,
                        name: req.files.file.name,
                        url: `${config.domain}/api/v1/files/download/${serverPath}`
                      }
                      sendSuccessResponse(res, 200, payload)
                    }
                  })
              })
          })
          .catch(error => {
            const message = err || 'Failed to fetch page'
            logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
            sendErrorResponse(res, 500, `Failed to fetch page ${JSON.stringify(error)}`)
          })
      } else {
        let payload = {
          id: serverPath,
          name: req.files.file.name,
          url: `${config.domain}/api/v1/files/download/${serverPath}`
        }
        sendSuccessResponse(res, 200, payload)
      }
    }
  )
}

exports.uploadForTemplate = function (req, res) {
  let dir = path.resolve(__dirname, '../../../../broadcastFiles/')
  console.log('console.body', req.body)
  console.log('console.body', req.body.deleteLater)
  if (req.body.pages && req.body.pages.length > 0) {
    // saving this file to send files with its original name
    // it will be deleted once it is successfully uploaded to facebook
    let readData = fs.createReadStream(dir + '/userfiles/' + req.body.id)
    let writeData = fs.createWriteStream(dir + '/userfiles/' + req.body.name)
    readData.pipe(writeData)
    pageDataLayer.findOnePageObject(req.body.pages[0])
      .then(page => {
        needle.get(
          `https://graph.facebook.com/v6.0/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
          (err, resp2) => {
            if (err) {
              const message = 'unable to get page access_token: ' + JSON.stringify(err)
              logger.serverLog(message, `${TAG}: exports.index`, req.body, {user: req.user}, 'error')
              sendErrorResponse(res, 500, '', 'unable to get page access_token: ' + JSON.stringify(err))
            }
            let pageAccessToken = resp2.body.access_token

            let fileReaderStream = fs.createReadStream(dir + '/userfiles/' + req.body.name)
            const messageData = {
              'message': JSON.stringify({
                'attachment': {
                  'type': req.body.componentType,
                  'payload': {
                    'is_reusable': true
                  }
                }
              }),
              'filedata': fileReaderStream
            }
            request(
              {
                'method': 'POST',
                'json': true,
                'formData': messageData,
                'uri': 'https://graph.facebook.com/v6.0/me/message_attachments?access_token=' + pageAccessToken
              },
              function (err, resp) {
                // deleteFile(req.body.name)
                if (err) {
                  logger.serverLog('unable to upload attachment on Facebook', `${TAG}: exports.uploadForTemplate`, req.body, {user: req.user}, 'error')
                  sendErrorResponse(res, 500, '', 'unable to upload attachment on Facebook, sending response' + JSON.stringify(err))
                } else if (resp.body) {
                  if (resp.body.error) {
                    logger.serverLog('unable to upload attachment on Facebook', `${TAG}: exports.uploadForTemplate`, req.body, {user: req.user}, 'error')
                    sendErrorResponse(res, 500, '', 'unable to upload attachment on Facebook, sending response' + JSON.stringify(resp.body.error))
                  } else {
                    logger.serverLog(
                      `file uploaded on Facebook template ${JSON.stringify(resp.body)}`, TAG)
                    let payload = {
                      id: req.body.id,
                      attachment_id: resp.body.attachment_id,
                      name: req.body.name,
                      url: req.body.url
                    }
                    if (req.body.deleteLater) {
                      deleteFile(req.body.id)
                    }
                    sendSuccessResponse(res, 200, payload)
                  }
                }
              })
          })
      })
      .catch(error => {
        const message = error || '`Failed to fetch page'
        logger.serverLog(message, `${TAG}: exports.uploadForTemplate`, req.body, {user: req.user}, 'error')
        sendErrorResponse(res, 500, `Failed to fetch page ${JSON.stringify(error)}`)
      })
  } else {
    sendErrorResponse(res, 500, `Failed to upload`)
  }
}

function deleteFile (id) {
  let dir = path.resolve(__dirname, '../../../../broadcastFiles/')
  // unlink file
  fs.unlink(dir + '/userfiles/' + id, function (err) {
    if (err) {
      logger.serverLog(err, `${TAG}: exports.uploadForTemplate`, id, {}, 'error')
    } else {
      logger.serverLog('file deleted successfully', TAG)
    }
  })
}

exports.download = function (req, res) {
  let dir = path.resolve(__dirname, '../../../../broadcastFiles/userfiles')
  // try {
  //   res.sendfile(req.params.id, {root: dir})
  // } catch (err) {
  //   logger.serverLog(TAG,
  //     Inside Download file, err = ${JSON.stringify(err)})
  //   sendSuccessResponse(res, 404, 'Not Found ' + JSON.stringify(err))
  // }
  res.sendFile(req.params.id, {root: dir}, function (err) {
    if (err) {
      if (err && (err === 'Request aborted' || err.message === 'Request aborted' || err.message.includes('EPIPE'))) {
        res.status(err.statusCode || 500).end()
      } else {
        logger.serverLog(err, `${TAG}: exports.download`, req.body, {id: req.params.id, user: req.user}, 'error')
      }
    } else {
      logger.serverLog(
        `Inside Download file, req.params.id: = ${req.params.id}`, TAG)
    }
  })
}
exports.downloadYouTubeVideo = function (req, res) {
  downloadVideo(req.body)
    .then(video => {
      sendSuccessResponse(res, 200, video)
    })
    .catch(err => {
      const message = err || 'Failed to downloadYouTubeVideo'
      if (message !== 'ERROR: wHFflWvii3M: YouTube said: Unable to extract video data') {
        logger.serverLog(message, `${TAG}: exports.downloadYouTubeVideo`, req.body, {user: req.user}, 'error')
      }
      sendErrorResponse(res, 500, '', 'Unable to process video link. Please try again.')
    })
}

function downloadVideo (data) {
  return new Promise((resolve, reject) => {
    let dir = path.resolve(__dirname, '../../../../broadcastFiles/userfiles')
    let video = youtubedl(data.url, ['--format=18'])
    let stream1
    let stream2

    video.on('error', function error (err) {
      let error = err.stderr ? err.stderr : err
      reject(error)
    })
    video.on('info', (info) => {
      let today = new Date()
      let uid = crypto.randomBytes(5).toString('hex')
      let serverPath = 'f' + uid + '' + today.getFullYear() + '' +
        (today.getMonth() + 1) + '' + today.getDate()
      serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
        today.getSeconds()
      let fext = info._filename.split('.')
      serverPath += '.' + fext[fext.length - 1].toLowerCase()
      let size = info.size
      console.log('serverPath', serverPath)
      if (size < 25000000) {
        stream1 = video.pipe(fs.createWriteStream(`${dir}/${serverPath}`))
        stream1.on('error', (error) => {
          stream1.end()
          reject(error)
        })
        stream1.on('finish', () => {
          video = fs.createReadStream(`${dir}/${serverPath}`)
          stream2 = video.pipe(fs.createWriteStream(`${dir}/${info._filename}`))
          stream2.on('error', (error) => {
            stream2.end()
            reject(error)
          })
          stream2.on('finish', () => {
            console.log('serverPath in finish', serverPath)
            resolve({
              id: data.id,
              componentType: 'video',
              fileName: info._filename,
              type: `video/${info.ext}`,
              size: info.size,
              fileurl: {
                id: serverPath,
                name: `${info._filename}`,
                url: `${config.domain}/api/v1/files/download/${serverPath}`
              }})
          })
        })
      } else {
        resolve('ERR_LIMIT_REACHED')
      }
    })
  })
}

exports.deleteFile = function (req, res) {
  let file = path.resolve(__dirname, `../../../../broadcastFiles/userfiles/${req.params.id}`)
  fs.unlink(file, (err) => {
    if (err) {
      const message = err || 'Failed to deleteFile'
      logger.serverLog(message, `${TAG}: exports.deleteFile`, req.body, {user: req.user}, 'error')
      sendErrorResponse(res, 500, `Failed to delete file ${err}`)
    } else {
      sendSuccessResponse(res, 200, `${file} was succesfully deleted`)
    }
  })
}

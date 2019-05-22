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

exports.index = function (req, res) {
  console.log('in upload function', req.files)
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
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }
  logger.serverLog(TAG,
    `req.files.file ${JSON.stringify(req.files.file.path)}`)
  logger.serverLog(TAG,
    `req.files.file ${JSON.stringify(req.files.file.name)}`)
  logger.serverLog(TAG,
    `dir ${JSON.stringify(dir)}`)
  logger.serverLog(TAG,
    `serverPath ${JSON.stringify(serverPath)}`)
  fs.rename(
    req.files.file.path,
    dir + '/userfiles/' + serverPath,
    err => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      // saving this file to send files with its original name
      // it will be deleted once it is successfully sent
      let readData = fs.createReadStream(dir + '/userfiles/' + serverPath)
      let writeData = fs.createWriteStream(dir + '/userfiles/' + req.files.file.name)
      readData.pipe(writeData)
      logger.serverLog(TAG,
        `file uploaded on KiboPush, uploading it on Facebook: ${JSON.stringify({
          id: serverPath,
          url: `${config.domain}/api/v1/files/download/${serverPath}`
        })}`)
      if (req.body.pages && req.body.pages !== 'undefined' && req.body.pages.length > 0) {
        let pages = JSON.parse(req.body.pages)
        logger.serverLog(TAG, `Pages in upload file ${pages}`)
        pageDataLayer.findOnePageObject(pages[0])
          .then(page => {
            needle.get(
              `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
              (err, resp2) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: 'unable to get page access_token: ' + JSON.stringify(err)
                  })
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
                    'uri': 'https://graph.facebook.com/v2.6/me/message_attachments?access_token=' + pageAccessToken
                  },
                  function (err, resp) {
                    if (err) {
                      return res.status(500).json({
                        status: 'failed',
                        description: 'unable to upload attachment on Facebook, sending response' + JSON.stringify(err)
                      })
                    } else {
                      logger.serverLog(TAG,
                        `file uploaded on Facebook index ${JSON.stringify(resp.body)}`)
                      return res.status(201).json({
                        status: 'success',
                        payload: {
                          id: serverPath,
                          attachment_id: resp.body.attachment_id,
                          name: req.files.file.name,
                          url: `${config.domain}/api/v1/files/download/${serverPath}`
                        }
                      })
                    }
                  })
              })
          })
          .catch(error => {
            return res.status(500).json({status: 'failed', payload: `Failed to fetch page ${JSON.stringify(error)}`})
          })
      } else {
        return res.status(201).json({
          status: 'success',
          payload: {
            id: serverPath,
            name: req.files.file.name,
            url: `${config.domain}/api/v1/files/download/${serverPath}`
          }
        })
      }
    }
  )
}

exports.uploadForTemplate = function (req, res) {
  let dir = path.resolve(__dirname, '../../../../broadcastFiles/')
  console.log('uploadForTemplate req.body', req.body)
  if (req.body.pages && req.body.pages.length > 0) {
    pageDataLayer.findOnePageObject(req.body.pages[0])
      .then(page => {
        console.log('page fetched', page)
        needle.get(
          `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
          (err, resp2) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: 'unable to get page access_token: ' + JSON.stringify(err)
              })
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
            console.log('messageData', messageData)
            request(
              {
                'method': 'POST',
                'json': true,
                'formData': messageData,
                'uri': 'https://graph.facebook.com/v2.6/me/message_attachments?access_token=' + pageAccessToken
              },
              function (err, resp) {
                if (err) {
                  console.log('error in uploading', err)
                  return res.status(500).json({
                    status: 'failed',
                    description: 'unable to upload attachment on Facebook, sending response' + JSON.stringify(err)
                  })
                } else {
                  logger.serverLog(TAG,
                    `file uploaded on Facebook template ${JSON.stringify(resp.body)}`)
                  return res.status(201).json({
                    status: 'success',
                    payload: {
                      id: req.body.id,
                      attachment_id: resp.body.attachment_id,
                      name: req.body.name,
                      url: req.body.url
                    }
                  })
                }
              })
          })
      })
      .catch(error => {
        return res.status(500).json({status: 'failed', payload: `Failed to fetch page ${JSON.stringify(error)}`})
      })
  } else {
    return res.status(500).json({status: 'failed', payload: `Failed to upload`})
  }
}

exports.download = function (req, res) {
  let dir = path.resolve(__dirname, '../../../../broadcastFiles/userfiles')
  try {
    res.sendfile(req.params.id, {root: dir})
  } catch (err) {
    logger.serverLog(TAG,
      `Inside Download file, err = ${JSON.stringify(err)}`)
    res.status(404)
      .json({status: 'success', payload: 'Not Found ' + JSON.stringify(err)})
  }
}

exports.downloadYouTubeVideo = function (req, res) {
  console.log(`downloadYouTubeVideo req.body ${req.body}`)
  downloadVideo(req.body)
    .then(video => {
      console.log('YouTube Video successfully downloaded', video)
      res.status(200).json({status: 'success', payload: video})
    })
    .catch(err => {
      console.log('downloadYouTubeVideo error', err)
      logger.serverLog(TAG,
        `Inside Download file, err = ${JSON.stringify(err)}`)
      res.status(404)
        .json({status: 'success', payload: 'Not Found ' + JSON.stringify(err)})
    })
}

function downloadVideo (data) {
  return new Promise((resolve, reject) => {
    let dir = path.resolve(__dirname, '../../../../broadcastFiles/userfiles')
    let video = youtubedl(data.url, ['--format=18'])
    let stream1
    let stream2

    video.on('info', (info) => {
      // console.log('youtube video info', info)
      let today = new Date()
      let uid = crypto.randomBytes(5).toString('hex')
      let serverPath = 'f' + uid + '' + today.getFullYear() + '' +
        (today.getMonth() + 1) + '' + today.getDate()
      serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
        today.getSeconds()
      let fext = info._filename.split('.')
      console.log('file text', fext)
      serverPath += '.' + fext[fext.length - 1].toLowerCase()
      console.log('serverPath', serverPath)
      console.log('url', `${config.domain}/api/v1/files/download/${serverPath}`)
      logger.serverLog(TAG, 'Download started')
      logger.serverLog(TAG, 'filename: ' + info._filename)
      logger.serverLog(TAG, 'size: ' + info.size)
      let size = info.size
      if (size < 10000000) {
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

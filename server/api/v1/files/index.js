const express = require('express')
const router = express.Router()

const controller = require('./files.controller')

router.get('/download/:id', controller.download)

module.exports = router

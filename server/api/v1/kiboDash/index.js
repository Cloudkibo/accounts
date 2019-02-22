/**
 * Created by sojharo on 25/09/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./kiboDash.controller')

router.get('/', controller.platformWiseData)
router.post('/getPlatformData', controller.platformWiseData)
router.post('/getPageData', controller.pageWiseData)
router.post('/getCompanyData', controller.companyWiseData)
router.post('/getFacebookAutoposting', controller.getFacebookAutoposting)
router.post('/getTwitterAutoposting', controller.getTwitterAutoposting)
router.post('/getWordpressAutoposting', controller.getWordpressAutoposting)

module.exports = router

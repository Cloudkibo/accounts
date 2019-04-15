const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/tagsDataForPageId', controller.normalizeTagsDataForPageId)
router.get('/listsData', controller.normalizeListsData)
router.get('/tagsData', controller.normalizeTagsData)
router.get('/pagesData', controller.normalizePagesData)
router.get('/tagSubscribers', controller.normalizeTagSubscribers)
router.get('/tagSubscribersDefault', controller.normalizeTagSubscribersDefault)
router.get('/tagSubscribersList', controller.normalizeTagSubscribersList)

module.exports = router

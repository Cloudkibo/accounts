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
router.post('/defaultTags', controller.normalizeDefaultTags)
router.post('/associateDefaultTags', controller.associateDefaultTags)
router.post('/defaultTags/unsubscribe', controller.normalizeDefaultTagsUnsubscribe)
router.post('/associateTag/unsubscribe', controller.normalizeAssociateTagsUnsubscribe)

module.exports = router

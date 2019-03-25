const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/tagsDataForPageId', controller.normalizeTagsDataForPageId)
router.get('/listsData', controller.normalizeListsData)
router.get('/tagsData', controller.normalizeTagsData)
router.get('/pagesData', controller.normalizePagesData)

module.exports = router

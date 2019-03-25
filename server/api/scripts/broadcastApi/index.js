const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/tagsDataForPageId', controller.normalizeTagsDataForPageId)
router.get('/listsData', controller.normalizeListsData)
router.get('/tagsData', controller.normalizeTagsData)

module.exports = router

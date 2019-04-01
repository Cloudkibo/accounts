const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/susbscribers/normalizeDatetime', controller.normalizeSubscribersDatetime)
router.get('/susbscribers/normalizeDatetimeNull', controller.normalizeSubscribersDatetimeNull)
router.get('/subscribers/addFullName', controller.addFullName)
router.get('/subscribers/putSessionDetails', controller.putSessionDetails)
router.get('/normalizePageUrls', controller.normalizePageUrls)
router.get('/normalizeCommentUrls', controller.normalizeCommentUrls)
router.get('/normalizeReferralUrls', controller.normalizeReferralUrls)
router.get('/normalizePersistentMenu', controller.normalizePersistentMenu)
router.get('/user/normalizeForFbDisconnect', controller.normalizeForFbDisconnect)
router.get('/user/normalizeForPlatform', controller.normalizeForPlatform)
router.get('/analyzePages', controller.analyzepages)

module.exports = router

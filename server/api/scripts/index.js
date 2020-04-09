const express = require('express')
const router = express.Router()
const controller = require('./controller.js')

router.get('/susbscribers/normalizeDatetime', controller.normalizeSubscribersDatetime)

router.get('/susbscribers/normalizeSubscribersDataLastActivity', controller.normalizeSubscribersDataLastActivity)
router.get('/susbscribers/normalizeDatetimeNull', controller.normalizeSubscribersDatetimeNull)
router.get('/subscribers/addFullName', controller.addFullName)
router.get('/subscribers/putSessionDetails', controller.putSessionDetails)
router.get('/normalizePageUrls', controller.normalizePageUrls)
router.get('/normalizeCommentUrls', controller.normalizeCommentUrls)
router.get('/normalizeReferralUrls', controller.normalizeReferralUrls)
router.get('/normalizePersistentMenu', controller.normalizePersistentMenu)
router.get('/user/normalizeForFbDisconnect', controller.normalizeForFbDisconnect)
router.get('/user/normalizeForPlatform', controller.normalizeForPlatform)
router.post('/analyzePages', controller.analyzePages)
router.get('/deleteUnapprovedPages', controller.deleteUnapprovedPages)
router.get('/normalizeUnreadCount', controller.normalizeUnreadCount)
router.get('/normalizeMessagesCount', controller.normalizeMessagesCount)
router.post('/subscribers/normalizeLastMessagedAt', controller.normalizeLastMessagedAt)
router.get('/normalizeCommentCapture', controller.normalizeCommentCapture)
router.get('/companyUsers/normalize', controller.normalizeCompanyUsers)

router.use('/broadcast_api/normalize', require('./broadcastApi'))
router.use('/pages', require('./pages'))
router.use('/tags/normalize', require('./tags'))

module.exports = router

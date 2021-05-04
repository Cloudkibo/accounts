const express = require('express')
const router = express.Router()
const companyUsageController = require('./companyUsage.controller.js')
const permissionsController = require('./permissions.controller.js')
const planController = require('./plan.controller.js')
const companyController = require('./company.controller.js')

router.post('/normalize/companyUsage/engagement', companyUsageController.engagementFeatures)
router.post('/normalize/companyUsage/support', companyUsageController.supportFeatures)
router.post('/normalize/companyUsage/automation', companyUsageController.automationFeatures)
router.post('/normalize/companyUsage/others', companyUsageController.otherFeatures)
router.get('/normalize/rolePermissions', permissionsController.rolePermissions)
router.post('/normalize/userPermissions', permissionsController.userPermissions)
router.get('/normalize/planPermissions', planController.planPermissions)
router.get('/normalize/planUsage', planController.planUsage)
router.get('/normalize/messengerPlans', planController.createFbUpdatePlans)
router.post('/normalize/connectedPages', companyController.connectedPages)

module.exports = router

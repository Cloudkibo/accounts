const Permissions = require('../../v1/permissions/permissions.model')
const Users = require('../../v1/user/user.model')
const logger = require('../../../components/logger')
const TAG = '/api/scripts/slaDashboard/controller.js'

exports.normazliUserPermissions = function (req, res) {
  Users.aggregate([
    {$match: {role: 'buyer'}},
    {$skip: req.body.skip},
    {$limit: req.body.limit}
  ]).exec()
    .then(users => {
      if (users.length > 0) {
        const ids = users.map((u) => u._id)
        Permissions.update({userId: {$in: ids}}, {sla_dashboard: true}, {multi: true}).exec()
          .then(updated => {
            return res.status(200).json({status: 'success', description: 'Normalized successfully!'})
          })
          .catch(err => {
            const message = err || 'Failed to fetch users'
            logger.serveLog(message, `${TAG} exports.normazliUserPermissions`, req.body, {}, 'error')
          })
      } else {
        return res.status(200).json({status: 'success', description: 'No users found'})
      }
    })
    .catch(err => {
      const message = err || 'Failed to fetch users'
      logger.serveLog(message, `${TAG} exports.normazliUserPermissions`, req.body, {}, 'error')
    })
}

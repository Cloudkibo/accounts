// const {google} = require('googleapis')
// var cloudResourceManager = google.cloudresourcemanager('v1beta1')
//
// exports.index = function (req, res) {
//   authorize(function (authClient) {
//     var request = {
//       resource: {
//         projectId: 'telco-demo-faizan',
//         name: 'Telco Demo Faizan',
//         parent: {
//           type: 'organization',
//           id: '652438098598'
//         }
//       },
//       auth: authClient
//     }
//
//     cloudResourceManager.projects.create(request, function (err, response) {
//       if (err) {
//         console.error(err)
//         return
//       }
//
//       // TODO: Change code below to process the `response` object:
//       console.log(JSON.stringify(response, null, 2))
//     })
//   })
//   return res.status(200).json({status: 'success'})
// }
//
// async function authorize (callback) {
//   const auth = new google.auth.GoogleAuth({
//     scopes: ['https://www.googleapis.com/auth/cloud-platform']
//   })
//   const authClient = await auth.getClient()
//   callback(authClient)
//   console.log('authClient', authClient)
// }

const {JWT} = require('google-auth-library')

async function main (keyFile = '/Users/cloudkibo/Downloads/smart-reply-dev-66c9c58c745e.json') {
  const keys = require(keyFile)
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/dialogflow']
  })
  const url = `https://dialogflow.googleapis.com/v2/projects/kibochat-smart-replies/agent`
  const data = {
    displayName: 'KiboChat-Agent'
  }
  console.log('before making request')
  const res = await client.request({
    url,
    method: 'POST',
    data: JSON.stringify(data)
  })
  console.log('project Info:')
  console.log(res)

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  // console.log('token', client.credentials)
  // const tokenInfo = await client.getTokenInfo(client.credentials.access_token)
  // console.log('tokenInfo', tokenInfo)
}

// const args = process.argv.slice(2)
// main(...args).catch(console.error)

exports.index = function (req, res) {
  main()
  return res.status(200).json({status: 'success'})
}

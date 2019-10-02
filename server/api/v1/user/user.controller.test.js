const request = require('supertest')
const app = require('./../../../app')

// this is just a testing sample test code
// will need to make it bigger
describe('Test the root path', () => {
  test('It should response the GET method', () => {
    return request(app).get('/api/v1/user/').expect(200)
  })
})

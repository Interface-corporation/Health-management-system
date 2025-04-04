const cors = require('cors')
const bodyParser = require('body-parser')

module.exports = (app) => {
  app.use(cors()) // Enable CORS for all routes
  app.use(bodyParser.json()) // Parse JSON request bodies
  app.use(bodyParser.urlencoded({ extended: true })) // Parse URL-encoded request bodies
}

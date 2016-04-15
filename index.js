require('./bootstrap')
let path = require('path')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
// let MongoStore = require('connect-mongo')(session)
// let mongoose = require('mongoose')
let requireDir = require('require-dir')

let App = require('./app/app')
let config = requireDir('./config', {recurse: true})
let port = process.env.PORT || 8000
let app = new App(config)

app.initialize(port)
  .then(() => console.log(`Listening @ http://127.0.0.1:${port}`))
  // ALWAYS REMEMBER TO CATCH!
  .catch((e) => console.log(e.stack ? e.stack : e))

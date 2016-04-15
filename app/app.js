let express = require('express')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let path = require('path')
let bodyParser = require('body-parser')
let session = require('express-session')
let browserify = require('browserify-middleware')
let babelify = require('express-babelify-middleware')

const NODE_ENV = process.env.NODE_ENV || 'development'
let routes = require('./routes')

let Server = require('http').Server
let io = require('socket.io')


class App {
		
	constructor(config) {
		let app = this.app = express()
		app.config = {
		  database: config.database[NODE_ENV]
		}

		// connect to the database
		// mongoose.connect(app.config.database.url)

		// set up our express middleware
		app.use(morgan('dev')) // log every request to the console
		app.use(cookieParser('ilovethenodejs')) // read cookies (needed for auth)
		app.use(bodyParser.json()) // get information from html forms
		app.use(bodyParser.urlencoded({ extended: true }))

		app.set('views', path.join(__dirname, 'views'))
		app.set('view engine', 'ejs') // set up ejs for templating

		// required for passport
		app.use(session({
		  secret: 'ilovethenodejs',
		  // store: new MongoStore({db: 'social-feeder'}),
		  resave: true,
		  saveUninitialized: true
		}))

		// browserify.settings({transform: ['babelify']})
		// //browserify().transform('babelify')
        
        app.use('/js/index.js', babelify('./public/js/index.js'))

  		
		routes(app)

		this.server = Server(app)
        this.io = io(this.server)

        // this.io.on('connection', socket => {
        //     console.log('a user connected')
        //     socket.on('disconnect', () => console.log('user disconnected'))
       	// })

       	this.io.on('connection', socket => {
            socket.on('im', msg => {
                // im received
                console.log(msg)
                // echo im back
                this.io.emit('im', msg)
            })
       })

	}

	async initialize(port) {
       	await this.server.promise.listen(port)
        return this
    }
}

module.exports = App
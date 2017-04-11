/*
Set up
*/
var express = require('express');
var app = express(); 						// create app w/ express
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/config'); 			// load the config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var open = require('open');
var color = require('colors-cli/safe');
var srvLogger = require('express-logger');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/client'));
// log every request to the console
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended': 'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(srvLogger({path: "client/logs/server.log"}));
/*
Setting un the routes
*/
require('./app/routes.js')(app);

/*
listen (start app with node server.js)
*/
app.listen(port);
console.info(color.yellow.bold.underline("Server started.\nMagic happens on port " + port));
/*
Open default browser on default app url + port after a timeout (not immediatly)
*/
// setTimeout(function(){
//   console.log("Opening default browser on this URL: " + urlEasyRashApp+port)
//   open(urlEasyRashApp+port);
// }, 1000);

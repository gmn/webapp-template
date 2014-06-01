
// modules
var lib = require( './lib.js' );
var pgsql = require('./db.js').pg;

// Routes for our application
var routes = require('./routes'); 
var db_app_logic = require('./db_app_logic.js');

// express
var express = require('express');
var app = express();

// middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var connectionString = "postgres://rssdude:password@localhost/rsstool";

pgsql.connect(connectionString, function(err,db,done) 
{
  // simple logger
  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });

  // middleware to populate 'req.cookies'
  app.use(cookieParser('shhhh, very secret'));
  // middleware to populate 'req.body'
  app.use(bodyParser());
  // middleware to provide 'req.session'
  app.use(expressSession());

  // add application logic to db
  db_app_logic.setup(db); 

  // apply the routes 
  routes(app,db);

  var port = 3000;
  app.listen(port);
  console.log( "listening on port: " + port );
});

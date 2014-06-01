
// TODO: convert to Mongo-style:
//        * Error() handling
//        * nested-callback passing

var crypto = require('crypto');
var helper = require('./helper');

// Session Manager (DAO, Data Access Object)
exports.SessionManager = function SessionManager() {

  // user didn't use 'new' keyword
  if (false === (this instanceof SessionManager)) {
    return new SessionManager();
  }

  //
  // PRIVATE
  //
  var db_name = 'queryable_sessions.json';
  var that = this;

  function _loadSessionsDb() {
    if ( that.sessions )
      return;
    var queryable = require('queryable');
    that.sessions = queryable.open(db_name);
  };


  //
  // PUBLIC
  //
  this.sessions = null;

  // 
  this.startSession = function(username, callback) {
    // create queryable table if not exist, if exist load from it
    _loadSessionsDb();

    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');
    var session_obj = {'username': username, 'sess_id': session_id}
    this.sessions.insert(session_obj);
    callback(null,session_id);
  };

  this.endSession = function(session_id, callback) {
    _loadSessionsDb();
    var res = this.sessions.remove({ 'sess_id' : session_id });
    callback(null,res);
  };

  this.getUsername = function(session_id, callback) {
    if ( !session_id )
      return;
    _loadSessionsDb();
    var res = this.sessions.find( {'sess_id':session_id} ).sort( {date_created:-1} ).limit(1);
    if ( res && res._data && res._data[0] && res._data[0].username && res.length == 1  )
      return callback(null, res._data[0].username);
    return callback(new Error("Session: " + session_id + " does not exist"));
  };
};


/* 
 * Handles top-level pages. Checks if logged in and:
 *  - displays: login, logout, signup, welcome (placeholder to show logging in works)
 *  - handles: login, logout, signup
 */
function SessionPages()
{

  // user didn't use 'new' keyword
  if (false === (this instanceof SessionPages)) {
    return new SessionPages();
  }

  var sessions = new exports.SessionManager();

  /*
   * Express uses this to set username in request
   */
  this.isLoggedInMiddleware = function(req, res, next) {
      var session_id = req.cookies.session;
      sessions.getUsername(session_id, function(err, username) {
          if ( !err && username ) {
              req.username = username;
          }
          return next();
      });
  };




  this.displayLoginPage = function(req, res, next) { 
console.log("in displayLoginPage");
    helper.static_file( 'public/login.html', res );
/*
this is both wrong and right. it's wrong because I'm already using Express, 
which is perfectly suited to do static files for me. There are a lot of supporting
files: gif, images, css, etc, these all need handlers, unless you set a static 
directory. probably best to just do it Express way, although last time I tried
to set precedence with the static directory and had trouble */
  };

  this.handleLoginRequest = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log("user logged in with username: " + username + " pass: " + password);
    next();
  };

  this.displayLogoutPage = function(req, res, next) {
    helper.static_file( 'public/logout.html', res );
  };

  this.handleLogoutRequest = function(req, res, next) {
    next();
  };

  this.displaySignupPage = function(req, res, next) {
    helper.static_file( 'public/signup.html', res );
  };

  this.handleSignupRequest = function(req, res, next) {
    next();
  };

  this.displayWelcomePage = function(req, res, next) {
    helper.static_file( 'public/welcome.html', res );
  };

}

exports.SessionPages = SessionPages;

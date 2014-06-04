
// TODO: convert to Mongo-style:
//        * Error() handling
//        * nested-callback passing

var crypto = require('crypto');
var helper = require('./helper');

function _randHash() {
  var current_date = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');
  return session_id;
}


// Session Manager (DAO, Data Access Object)
exports.SessionManager = function SessionManager() 
{
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

    var session_id = _randHash();
    var session_obj = {'username': username, 'session_id': session_id}
    this.sessions.insert(session_obj);
    callback(null,session_id);
  };

  this.endSession = function(session_id, callback) {
    _loadSessionsDb();
    var res = this.sessions.remove({ 'session_id' : session_id });
    callback(null,res);
  };

  this.getUsername = function(session_id, callback) {
    if ( !session_id )
      return callback(null,null);
    _loadSessionsDb();
    var res = this.sessions.find( {'session_id':session_id} ).sort( {date_created:-1} ).limit(1);
    if ( res && res._data && res._data[0] && res._data[0].username && res.length == 1  )
      return callback(null, res._data[0].username);
    return callback(new Error("Session: " + session_id + " does not exist"));
  };
};



/* 
 * SessionPages
 *
 * Handles top-level pages. Checks if logged in and:
 *  - displays: login, logout, signup, welcome (placeholder to show logging in works)
 *  - handles: login, logout, signup
 */
function SessionPages(db)
{
  // user didn't use 'new' keyword
  if (false === (this instanceof SessionPages)) {
    return new SessionPages(db);
  }

  var static_pages_dir = 'pages/';
  var sess_manager = new exports.SessionManager();

  /*
   * Express uses this to set username in request
   */
  this.isLoggedInMiddleware = function(req, res, next) {
    if ( !req.cookies || !req.cookies.session_id )
      return next();
    sess_manager.getUsername(req.cookies.session_id, function(err, username) {
      if ( !err && username ) {
          req.username = username;
      }
      return next();
    });
  };


  this.displayLoginPage = function(req, res, next) { 
    helper.static_file( static_pages_dir + 'login.html', res );
  };

  this.handleLoginRequest = function(req, res, next) {
    if ( !req.body || !req.body.username || !req.body.password )
      return res.redirect('/login');
    var username = req.body.username.trim();
    var password = req.body.password.trim();
    console.log("login attempt => username: " + username + " pass: " + password);

    db.findByName( username, function(err, rows) {
  
      if ( !rows || rows.length < 1 ) {
        console.log( "user not found" );
        return res.redirect('/login');
      }

      // found user, now verify password
      if ( rows[0].password !== crypto.createHash('sha1').update(rows[0].salt+password).digest('hex') )
        return res.redirect('/login');

      sess_manager.startSession(username, function(err, session_id) {
        "use strict";
        if (err) return next(err);
        res.cookie('session_id', session_id);
        return res.redirect('/welcome');
      });
    });
  };

  this.displayGoodbyePage = function(req, res, next) {
    helper.static_file( static_pages_dir + 'goodbye.html', res );
  };

  this.handleLogoutRequest = function(req, res, next) {
    if ( ! req.cookies.session_id )
      return console.log( "session not set" );
    sess_manager.endSession( req.cookies.session_id, function(err, num_rmvd ) {
      res.cookie('session_id', '', {expires: new Date(Date.now())} );
      return res.redirect('/goodbye');
    });
  };

  this.displaySignupPage = function(req, res, next) {
    helper.static_file( static_pages_dir + 'signup.html', res );
  };

  this.handleSignupRequest = function(req, res, next) {
    // sanitize
    var form = {};
    for (i in req.body) {
      if ( req.body.hasOwnProperty(i) )
        form[i] = req.body[i] ? req.body[i].trim() : '';
    }
    // create a random salt
    form['salt'] = _randHash();
    form['password'] = crypto.createHash('sha1').update(form['salt']+form['password']).digest('hex');

    // validate form
    // ...

    db.userSignup( form, function(err,result) {
      
      if ( err ) {
        console.log("handleSignupRequest: error: " + err );
        return res.redirect('/signup');
      }

      sess_manager.startSession(form.username, function(err, session_id) {
        "use strict";
        if (err) return next(err);
        res.cookie('session_id', session_id);
        return res.redirect('/welcome');
      });
    });
  };

  this.displayWelcomePage = function(req, res, next) {
    "use strict";
    if (!req.username) {
      console.log("WelcomePage: can't identify user...redirecting to login page");
      return res.redirect("/login");
    }
    helper.static_file( static_pages_dir + 'welcome.html', res );
  };

}

exports.SessionPages = SessionPages;

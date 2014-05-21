
exports.SessionDAO = function(db) {
    if ( arguments.length < 1 ) {
        process.abort();
    }
    // user didn't use 'new' keyword
    if (false === (this instanceof SessionDAO)) {
        return new SessionDAO(db);
    }
  
    this.startSession = function(username,callback) {
    };

    this.endSession = function(session_id, callback) {
        db.sessions.removeById( session_id, function(err, numRemoved) {
        } );
    };

    this.getUsername = function(session_id, callback) {
  
        if ( !session_id )
            return;

        db.sessions.findById( session_id, function(err, session) {
        } );
    };
};

exports.isLoggedInMiddleware = function(req, res, next) {
    var session_id = req.cookies.session;
    sessions.getUsername(session_id, function(err, username) {
        if ( !err && username ) {
            req.username = username;
        }
        return next();
    };
};

//exports.displayLoginPage = function() { };

exports.handleLoginRequest = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log("user logged in with username: " + username + " pass: " + password);
};

exports.displayLogoutPage = function() {
};

exports.displayWelcomePage = function() {
};

exports.displaySignupPage = function() {
};

exports.handleSignup = function() {
};

var Session = require('./session.js');
var Content = require('./content.js');
var errorHandler = require('./error.js');
var helper = require( './helper.js' );

module.exports = exports = function(app, db) 
{
    var sessionHandler = new Session.SessionPages(db);

    //var contentHandler = new Content.ContentPages(db);
    //var errorHandler = new ErrorHandler(db); //do it this way if you wanted to log your errors in the db

    // Middleware to see if a user is logged in
    //app.use(sessionHandler.isLoggedInMiddleware);

    // Login form
    app.get('/login', sessionHandler.displayLoginPage);

/*
    app.post('/login', sessionHandler.handleLoginRequest);

    // Logout page
    app.get('/logout', sessionHandler.displayLogoutPage);
    app.post('/logout', sessionHandler.handleLogoutRequest);

    // Signup form
    app.get('/signup', sessionHandler.displaySignupPage);
    app.post('/signup', sessionHandler.handleSignupRequest);

    // Welcome page
    app.get("/welcome", sessionHandler.displayWelcomePage);
*/

    // The main page of the site
    //app.get('/', contentHandler.displayMainPage);

    // after the routes are checked, try to exact-match static file
    app.use( helper.staticFileMiddleware('./public') );

    app.use(errorHandler.handle404);
    app.use(errorHandler.errorHandler);
};

var Session = require('./session.js');
var Content = require('./content.js');
var errorHandler = require('./error.js');
var helper = require( './helper.js' );

module.exports = exports = function(app, db) 
{
    var sessionHandler = new Session.SessionPages(db);

    //var contentHandler = new Content.ContentPages(db);

    // Middleware to see if a user is logged in
    app.use(sessionHandler.isLoggedInMiddleware);

    // Login form
    app.get('/login', sessionHandler.displayLoginPage);
    app.post('/login', sessionHandler.handleLoginRequest);

    // Logout page
    app.post('/logout', sessionHandler.handleLogoutRequest);
    app.get('/goodbye', sessionHandler.displayGoodbyePage);

    // Signup form
    app.get('/signup', sessionHandler.displaySignupPage);
    app.post('/signup', sessionHandler.handleSignupRequest);

    // Welcome page
    app.get("/welcome", sessionHandler.displayWelcomePage);


    app.get("/", sessionHandler.displayWelcomePage);

    // The main page of the site
    //app.get('/', contentHandler.displayMainPage);

    // exact-match any static file in 'public'; note: can add more directories to search path
    var static_file = new helper.staticFileMiddleware(['./public']);
    app.use( static_file.getMiddleware() );

    // failing routes, and static-files, send errors
    app.use(errorHandler.handle404);
    app.use(errorHandler.errorHandler);
};

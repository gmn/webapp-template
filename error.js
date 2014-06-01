// Error handling middleware

exports.handle404 = function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

exports.errorHandler = function(err, req, res, next) {
    "use strict";
    var err_msg = err.status + ' ' + err.message ;
    console.error( err_msg );
    console.error( 'Stack: ' + err.stack);
    res.status(err.status || 500);
    res.send( err_msg ) ;
}

exports.error_handlers = function(app) {
    app.use(catch_404);
    app.use(errorHandler);
};

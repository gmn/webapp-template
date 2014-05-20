// Error handling middleware

exports.404Handler = function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

exports.errorHandler = function(err, req, res, next) {
    "use strict";
    console.error(err.message);
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('error_template', { error: err });
}

exports.error_handlers = function(app) {
    app.use(catch_404);
    app.use(errorHandler);
};

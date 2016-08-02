module.exports.notFoundHandler = (req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
};

module.exports.developmentDefaultHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
};

module.exports.productionDefaultHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
};
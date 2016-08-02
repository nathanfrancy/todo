let comb = require('comb');
let logger = comb.logger('mw.logging').addAppender('ConsoleAppender');

module.exports.location = (req, res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
};
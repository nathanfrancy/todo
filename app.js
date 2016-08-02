let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let comb = require('comb');
let logger = comb.logger('app').addAppender('ConsoleAppender');

logger.info("Starting todo app up...");

// Routes and middleware
let webRoutes = require('./routes/web');
let apiRoutes = require('./routes/api');
let mw = require('./routes/middleware');

// New up new express app
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Apply imported routes to express app.
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(mw.errorHandlers.notFoundHandler);

// TODO: get environment here, use one or the other.
app.use(mw.errorHandlers.developmentDefaultHandler);
app.use(mw.errorHandlers.productionDefaultHandler);

logger.info("Started app successfully...");

module.exports = app;
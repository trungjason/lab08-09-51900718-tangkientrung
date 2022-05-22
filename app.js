const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const csrf = require('csurf');

require('dotenv').config();
require('./database/database-connection');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');

const apiAccountRouter = require('./routes/apiAccount');
const apiProductsRouter = require('./routes/apiProducts');
const apiOrdersRouter = require('./routes/apiOrders');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: 'layout/main' });
app.set('view engine', 'hbs');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
})

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(require("express-session")());
app.use(express.static(path.join(__dirname, 'public')));

const csrfProtect = csrf({ cookie: true })

app.use('/', indexRouter);
app.use('/login', csrfProtect, loginRouter);
app.use('/register', csrfProtect, registerRouter);

app.use('/api/account', apiAccountRouter);
app.use('/api/products', apiProductsRouter);
app.use('/api/orders', apiOrdersRouter);

app.get("/logout", (req, res) => {
    req.session.destroy(function(err) {
        res.redirect("/");
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError.NotFound());
});

// error handler
app.use(function(err, req, res, next) {
    // Handle if csrf token is invalid then return json formated error
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ status: false, status_code: 403, message: err.message });
    }

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.error_code = err.status || 500;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const router = require('./server/routes/index');
const users = require('./server/routes/users');

const app = express();

// view engine setup
app.set('views', [__dirname+ '/views']);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, '/src'),
    indentedSyntax: false, // true = .sass or false = .scss
    //sourceMap: __dirname + '/public/sourcemaps_scss',
    debug: true,
    outputStyle: 'extended', // compressed = min
    log: function(severity, key, value){console.log(severity, 'node-sass-middleware', key, value);}
}));
app.use(express.static(path.join(__dirname, '/src')));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', router);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    //console.log(err, req.url);
    const pathSplit = req.url.split('/');
    let pathConect = null;
    if(pathSplit[1] === '' || pathSplit[1] === 'p' || pathSplit[1] === 'm' || pathSplit[1] === 'r' || pathSplit[1] === 'admin'){
      pathConect = pathSplit[1];
    }else{
      pathConect = '';
    }
    res.render(__dirname+ '/views/error', {title: "404", path: pathConect});
});

app.set('port', process.env.PORT || 8000);
const server = app.listen(app.get('port'), function(){
    console.log('Express server listening on port' + server.address().port)
});
module.exports = app;

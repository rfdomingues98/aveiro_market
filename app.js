var express = require('express');
var hbs = require('express-handlebars')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.engine(
  'hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    partialsDir: path.join(__dirname, '/views/partials/'),
    helpers: require('./helpers/handlebars.js').helpers,
  })
);

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use('/font-awesome', express.static(path.join(__dirname, 'node_modules/font-awesome')));
app.use('/rateit', express.static(path.join(__dirname, 'node_modules/jquery.rateit/scripts')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;